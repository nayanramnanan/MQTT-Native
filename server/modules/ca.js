// Modules
import forge from 'node-forge'
import { genSerialNumber } from './functions.js'

// -----------------------
// Generate CA Certificate
// -----------------------
export const genCACertificate = (
    tenantName = '',
    years = 10,
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
            value: tenantName
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

    // Create self-signed certificate
    let cert = forge.pki.createCertificate()
    cert.publicKey = keys.publicKey
    cert.serialNumber = genSerialNumber()
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + options.years)
    cert.setSubject(attrs)
    cert.setIssuer(attrs)
    cert.setExtensions(exts)

    // Self-sign certificate
    cert.sign(keys.privateKey, forge.md.sha256.create())

    //Keys & Certification
    let CA = {
        publicKey: forge.pki.publicKeyToPem(keys.publicKey),
        privateKey: forge.pki.privateKeyToPem(keys.privateKey),
        certificate: forge.pki.certificateToPem(cert)
    }

    return CA
}
