// Modules
import forge from 'node-forge'
import { genSerialNumber } from './functions.js'

// ---------------------------
// Generate Device Certificate
// ---------------------------
export const genDeviceCertificate = (
    deviceName = '',
    tenantKeyPem,
    tenantCertPem,
    years = 1,
    C = 'US',
    ST = 'Georgia',
    L = 'Atlanta',
    O = 'Siemens',
    OU = 'IT'
) => {
    let options = {
        keySize: 2048,
        years: years
    }

    let attrs = [
        {
            shortName: 'CN',
            value: deviceName
        },
        {
            shortName: 'C',
            value: C
        },
        {
            shortName: 'ST',
            value: ST
        },
        {
            shortName: 'L',
            value: L
        },
        {
            shortName: 'O',
            value: O
        },
        {
            shortName: 'OU',
            value: OU
        }
    ]

    let exts = [
        {
            name: 'basicConstraints',
            cA: true
        }
    ]

    // Generate 2048bit key pair
    let keys = forge.pki.rsa.generateKeyPair(options.keySize)

    // Create certificate signing request
    let csr = forge.pki.createCertificationRequest()
    csr.publicKey = keys.publicKey
    csr.setSubject(attrs)

    // Sign certification request
    csr.sign(keys.privateKey)

    // Verify certification request
    if (!csr.verify()) throw new Error('Signature not verified.')

    // Write files
    let device = {
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        csr: forge.pki.certificationRequestToPem(csr)
    }

    // Read tenant files
    let tenantKey = forge.pki.privateKeyFromPem(tenantKeyPem)
    let tenantCert = forge.pki.certificateFromPem(tenantCertPem)

    // Issue the agent certificate using tenant's private key and CSR
    let cert = forge.pki.createCertificate()
    cert.serialNumber = genSerialNumber()
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + options.years)
    cert.publicKey = csr.publicKey
    cert.setSubject(csr.subject.attributes) // Subject from CSR
    cert.setIssuer(tenantCert.subject.attributes) // Issuer from CA
    cert.setExtensions(exts)

    // Self-sign certificate
    cert.sign(tenantKey, forge.md.sha256.create())

    // Certificate in PEM
    device.certificatePEM = forge.pki.certificateToPem(cert)

    // Certificate in PKCS12
    let p12Asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, device.certificatePEM, '', {
        algorithm: '3des', // Triple DES to attain maximum compatibility with PKCS parsers
        generateLocalKeyId: true // true is the default but it does not hurt to specify it anyway
    })
    let p12Der = forge.asn1.toDer(p12Asn1).getBytes()
    let p12b64 = forge.util.encode64(p12Der)
    device.certificatePKCS12 = p12b64

    return device
}
