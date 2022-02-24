//Modules
import express from 'express'
import { genCACertificate } from './ca.js'
import { genVerificationCertificate } from './verification.js'
import { genDeviceCertificate } from './device.js'

const router = express.Router()

export default router
    //==================================
    //POST: CA Certificate
    //==================================
    .post('/ca', async (req, res) => {
        try {
            let tenantName = req.body?.tenantName
            let years = Number(req.body?.years)
            let C = req.body?.C
            let ST = req.body?.ST
            let L = req.body?.L
            let O = req.body?.O
            let OU = req.body?.OU

            if (!tenantName) {
                res.status(400).send({
                    error: 'Parameter Missing',
                    description: `tenantName parameter is not defined`
                })
            } else {
                let ca = genCACertificate(tenantName, years, C, ST, L, O, OU)
                res.send(ca)
            }
        } catch (e) {
            res.status(500).send({ error: 'Unexpected Error', description: e.message })
        }
    })

    //==================================
    //POST: Verification Certificate
    //==================================
    .post('/verification', async (req, res) => {
        try {
            let registrationCode = req.body?.registrationCode
            let tenantKeyPem = req.body?.tenantKeyPem
            let tenantCertPem = req.body?.tenantCertPem
            let days = Number(req.body?.days)

            if (!registrationCode || !tenantKeyPem || !tenantCertPem) {
                res.status(400).send({
                    error: 'Parameter Missing',
                    description: `{${registrationCode ? '' : 'registrationCode '}${
                        tenantKeyPem ? '' : 'tenantKeyPem '
                    }${tenantCertPem ? '' : 'tenantCertPem '}} parameters is not defined`
                })
            } else {
                let verification = genVerificationCertificate(registrationCode, tenantKeyPem, tenantCertPem, days)
                res.send(verification)
            }
        } catch (e) {
            res.status(500).send({ error: 'Unexpected Error', description: e.message })
        }
    })

    //==================================
    //POST: Device Certificate
    //==================================
    .post('/device', async (req, res) => {
        try {
            let deviceName = req.body?.deviceName
            let tenantKeyPem = req.body?.tenantKeyPem
            let tenantCertPem = req.body?.tenantCertPem
            let years = Number(req.body?.years)
            let C = req.body?.C
            let ST = req.body?.ST
            let L = req.body?.L
            let O = req.body?.O
            let OU = req.body?.OU

            if (!deviceName || !tenantKeyPem || !tenantCertPem) {
                res.status(400).send({
                    error: 'Parameter Missing',
                    description: `{${deviceName ? '' : 'deviceName '}${tenantKeyPem ? '' : 'tenantKeyPem '}${
                        tenantKeyPem ? '' : 'tenantKeyPem '
                    }} parameters is not defined`
                })
            } else {
                let device = genDeviceCertificate(deviceName, tenantKeyPem, tenantCertPem, years, C, ST, L, O, OU)
                res.send(device)
            }
        } catch (e) {
            res.status(500).send({ error: 'Unexpected Error', description: e.message })
        }
    })
