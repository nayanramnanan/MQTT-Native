// -------------
// Download File
// -------------
const downloadFile = (filename, text) => {
    let el = document.createElement('a')
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    el.setAttribute('download', filename)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
}

// ----------------------
// Generate Serial Number
// ----------------------
const genSerialNumber = () => {
    // Serial number is a hex string no more than 20 octets and starts with a positive hex (i.e. first bit is 0)
    return (
        Math.floor(Math.random() * 8).toString() +
        [...Array(39)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    )
}

// -----------------------
// Generate CA Certificate
// -----------------------
const genCACertificate = (tenantName, years, C, ST, L, O, OU) => {
    return $.ajax({
        method: 'POST',
        url: '/forge/ca',
        dataType: 'json',
        data: {
            tenantName: tenantName,
            years: years,
            C: C,
            ST: ST,
            L: L,
            O: O,
            OU: OU
        }
    })
        .done((ca) => {
            $('#bi-ca-new').removeClass('is-shown')
            $('#ta-ca-key').val(ca.privateKey)
            $('#ta-ca-cert').val(ca.certificate)
            $('#a-tab-ver, #a-tab-dev, #btn-ca-clear, #btn-ca-dl-key, #btn-ca-dl-cert').removeClass('is-disabled')
        })
        .fail((xhr, textStatus, errorThrown) => {
            console.log(xhr.responseText)
        })
}

// ---------------------------------
// Generate Verification Certificate
// ---------------------------------
const genVerificationCertificate = (registrationCode, tenantKeyPem, tenantCertPem, days) => {
    return $.ajax({
        method: 'POST',
        url: '/forge/verification',
        dataType: 'json',
        data: {
            registrationCode: registrationCode,
            tenantKeyPem: tenantKeyPem,
            tenantCertPem: tenantCertPem,
            days: days
        }
    })
        .done((ver) => {
            $('#bi-ver-new').removeClass('is-shown')
            $('#ta-ver-cert').val(ver.certificate)
            $('#btn-ver-clear, #btn-ver-dl-cert').removeClass('is-disabled')
        })
        .fail((xhr, textStatus, errorThrown) => {
            console.log(xhr.responseText)
        })
}

// ---------------------------
// Generate Device Certificate
// ---------------------------
const genDeviceCertificate = (deviceName, tenantKeyPem, tenantCertPem, years, C, ST, L, O, OU) => {
    return $.ajax({
        method: 'POST',
        url: '/forge/device',
        dataType: 'json',
        data: {
            deviceName: deviceName,
            tenantKeyPem: tenantKeyPem,
            tenantCertPem: tenantCertPem,
            years: years,
            C: C,
            ST: ST,
            L: L,
            O: O,
            OU: OU
        }
    })
        .done((dev) => {
            $('#bi-dev-new').removeClass('is-shown')
            $('#ta-dev-key').val(dev.privateKey)
            $('#ta-dev-cert').val(dev.certificate)
            $('#btn-dev-clear, #btn-dev-dl-key, #btn-dev-dl-cert').removeClass('is-disabled')
        })
        .fail((xhr, textStatus, errorThrown) => {
            console.log(xhr.responseText)
        })
}
