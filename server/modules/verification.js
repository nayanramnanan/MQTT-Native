// Modules
import forge from 'node-forge'
import { genSerialNumber } from './functions.js'

// ---------------------------------
// Generate Verification Certificate
// ---------------------------------
export const genVerificationCertificate = (registrationCode = '', tenantKeyPem, tenantCertPem, days = 7) => {
    let options = {
        keySize: 2048,
        days: days
    }

    let attrs = [
        {
            shortName: 'CN',
            value: registrationCode
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

    // Keys & CSR
    let verification = {
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        csr: forge.pki.certificationRequestToPem(csr)
    }

    // Read tenant files
    let tenantKey = forge.pki.privateKeyFromPem(tenantKeyPem)
    let tenantCert = forge.pki.certificateFromPem(tenantCertPem)

    // Issue the verification certificate using tenant's private key and CSR
    let cert = forge.pki.createCertificate()
    cert.serialNumber = genSerialNumber()
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + options.days)
    cert.publicKey = csr.publicKey
    cert.setSubject(csr.subject.attributes) // Subject from CSR
    cert.setIssuer(tenantCert.subject.attributes) // Issuer from CA
    cert.setExtensions(exts)

    // Self-sign certificate
    cert.sign(tenantKey, forge.md.sha256.create())

    // Certificate
    verification.certificate = forge.pki.certificateToPem(cert)

    return verification
}
