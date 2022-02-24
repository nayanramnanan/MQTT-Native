//HTML-Document is loaded and DOM is ready
$(document).ready(function () {
    // -------------
    // Tab Selection
    // -------------
    //CA Tab
    $('#a-tab-ca').on('click', function () {
        $(this).addClass('is-activated')
        $('#a-tab-ver, #a-tab-dev').removeClass('is-activated')
        $('#tc-ca').removeClass('is-hidden')
        $('#tc-ver, #tc-dev').addClass('is-hidden')
    })
    //Verification Tab
    $('#a-tab-ver').on('click', function () {
        $(this).addClass('is-activated')
        $('#a-tab-ca, #a-tab-dev').removeClass('is-activated')
        $('#tc-ver').removeClass('is-hidden')
        $('#tc-ca, #tc-dev').addClass('is-hidden')
    })
    //Device Tab
    $('#a-tab-dev').on('click', function () {
        $(this).addClass('is-activated')
        $('#a-tab-ca, #a-tab-ver').removeClass('is-activated')
        $('#tc-dev').removeClass('is-hidden')
        $('#tc-ca, #tc-ver').addClass('is-hidden')
    })

    // --------
    // Settings
    // --------
    //Load Settings
    if (!localStorage.getItem('CA-Valid-Years')) localStorage.setItem('CA-Valid-Years', '10')
    if (!localStorage.getItem('Verification-Valid-Days')) localStorage.setItem('Verification-Valid-Days', '7')
    if (!localStorage.getItem('Device-Valid-Years')) localStorage.setItem('Device-Valid-Years', '10')
    if (!localStorage.getItem('C')) localStorage.setItem('C', 'US')
    if (!localStorage.getItem('ST')) localStorage.setItem('ST', 'Georgia')
    if (!localStorage.getItem('L')) localStorage.setItem('L', 'Atlanta')
    if (!localStorage.getItem('O')) localStorage.setItem('O', 'Siemens')
    if (!localStorage.getItem('OU')) localStorage.setItem('OU', 'IT')

    //Settings Button
    $('.btn-settings').on('click', function () {
        $('#dialog-settings #ti-ca-years').val(localStorage.getItem('CA-Valid-Years'))
        $('#dialog-settings #ti-ver-days').val(localStorage.getItem('Verification-Valid-Days'))
        $('#dialog-settings #ti-dev-years').val(localStorage.getItem('Device-Valid-Years'))
        $('#dialog-settings #sel-C').val(localStorage.getItem('C'))
        $('#dialog-settings #ti-ST').val(localStorage.getItem('ST'))
        $('#dialog-settings #ti-L').val(localStorage.getItem('L'))
        $('#dialog-settings #ti-O').val(localStorage.getItem('O'))
        $('#dialog-settings #ti-OU').val(localStorage.getItem('OU'))
        $('#dialog-settings').addClass('is-shown')
    })

    //Default Button
    $('.btn-default').on('click', function () {
        $('#dialog-settings #ti-ca-years').val('10')
        $('#dialog-settings #ti-ver-days').val('7')
        $('#dialog-settings #ti-dev-years').val('10')
        $('#dialog-settings #sel-C').val('US')
        $('#dialog-settings #ti-ST').val('Georgia')
        $('#dialog-settings #ti-L').val('Atlanta')
        $('#dialog-settings #ti-O').val('Siemens')
        $('#dialog-settings #ti-OU').val('IT')
    })

    //Cancel Button
    $('#dialog-settings .btn-cancel').on('click', function () {
        $('#dialog-settings').removeClass('is-shown')
    })

    //Save Button
    $('#form-settings').on('submit', function () {
        console.log('submitted')
        localStorage.setItem('CA-Valid-Years', $('#dialog-settings #ti-ca-years').val().trim())
        localStorage.setItem('Verification-Valid-Days', $('#dialog-settings #ti-ver-days').val().trim())
        localStorage.setItem('Device-Valid-Years', $('#dialog-settings #ti-dev-years').val().trim())
        localStorage.setItem('C', $('#dialog-settings #sel-C').val().trim())
        localStorage.setItem('ST', $('#dialog-settings #ti-ST').val().trim())
        localStorage.setItem('L', $('#dialog-settings #ti-L').val().trim())
        localStorage.setItem('O', $('#dialog-settings #ti-O').val().trim())
        localStorage.setItem('OU', $('#dialog-settings #ti-OU').val().trim())
        $('#dialog-settings').removeClass('is-shown')
        return false //prevents reload page
    })

    // --------------
    // CA Certificate
    // --------------
    //New Button
    $('#btn-ca-new').on('click', function () {
        $('#bi-ca-new').addClass('is-shown')
        $('#btn-ca-im-key, #btn-ca-im-cert, #btn-ca-new, #ti-ca-tenant').addClass('is-disabled')
        //Cert
        let tenantName = $('#ti-ca-tenant').val().trim()
        let years = Number(localStorage.getItem('CA-Valid-Years'))
        let C = localStorage.getItem('C')
        let ST = localStorage.getItem('ST')
        let L = localStorage.getItem('L')
        let O = localStorage.getItem('O')
        let OU = localStorage.getItem('OU')
        genCACertificate(tenantName, years, C, ST, L, O, OU)
    })

    //Clear Button
    $('#btn-ca-clear').on('click', function () {
        $('#ti-ca-tenant').val('')
        $('#ta-ca-key').val('')
        $('#ta-ca-cert').val('')
        $('#a-tab-ver, #a-tab-dev, #btn-ca-new, #btn-ca-clear, #btn-ca-dl-key, #btn-ca-dl-cert').addClass('is-disabled')
        $('#btn-ca-im-key, #btn-ca-im-cert, #ti-ca-tenant').removeClass('is-disabled')
    })

    //Import Buttons
    $('#btn-ca-im-key').on('click', function () {
        $('#file-ca-key-import').val('')
        $('#file-ca-key-import').trigger('click')
    })
    $('#btn-ca-im-cert').on('click', function () {
        $('#file-ca-cert-import').val('')
        $('#file-ca-cert-import').trigger('click')
    })
    $('#file-ca-key-import').on('input', function () {
        let reader = new FileReader()
        reader.onload = () => {
            $('#ta-ca-key').val(reader.result)
            $('#btn-ca-im-key, #ti-ca-tenant').addClass('is-disabled')
            $('#btn-ca-clear').removeClass('is-disabled')
            //Both cert and key are loaded
            if ($('#ta-ca-cert').val().trim()) {
                $('#a-tab-dev').removeClass('is-disabled')
            }
        }
        reader.readAsText(this.files[0])
    })
    $('#file-ca-cert-import').on('input', function () {
        let reader = new FileReader()
        reader.onload = () => {
            $('#ta-ca-cert').val(reader.result)
            $('#btn-ca-im-cert, #ti-ca-tenant').addClass('is-disabled')
            $('#btn-ca-clear').removeClass('is-disabled')
            //Both cert and key are loaded
            if ($('#ta-ca-key').val().trim()) {
                $('#a-tab-dev').removeClass('is-disabled')
            }
        }
        reader.readAsText(this.files[0])
    })

    //Download Buttons
    $('#btn-ca-dl-key').on('click', function () {
        let tenant = $('#ti-ca-tenant').val().trim()
        downloadFile(`${tenant}.key`, $('#ta-ca-key').val())
    })
    $('#btn-ca-dl-cert').on('click', function () {
        let tenant = $('#ti-ca-tenant').val().trim()
        downloadFile(`${tenant}.pem`, $('#ta-ca-cert').val())
    })

    //Tenant Name
    $('#ti-ca-tenant').on('input', function () {
        let value = $(this).val().trim()
        if (!value) {
            //Empty
            $('#btn-ca-new, #btn-ca-clear').addClass('is-disabled')
            $('#btn-ca-im-key, #btn-ca-im-cert').removeClass('is-disabled')
        } else {
            //Value
            $('#btn-ca-new, #btn-ca-clear').removeClass('is-disabled')
            $('#btn-ca-im-key, #btn-ca-im-cert').addClass('is-disabled')
        }
    })

    // ------------------------
    // Verification Certificate
    // ------------------------
    //New Button
    $('#btn-ver-new').on('click', function () {
        $('#bi-ver-new').addClass('is-shown')
        $('#btn-ver-new, #ti-ver-regcode').addClass('is-disabled')
        //Cert
        let registrationCode = $('#ti-ver-regcode').val().trim()
        let tenantKeyPem = $('#ta-ca-key').val()
        let tenantCertPem = $('#ta-ca-cert').val()
        let days = Number(localStorage.getItem('Verification-Valid-Days'))
        genVerificationCertificate(registrationCode, tenantKeyPem, tenantCertPem, days)
    })

    //Clear Button
    $('#btn-ver-clear, #btn-ca-clear').on('click', function () {
        $('#ti-ver-regcode').val('')
        $('#ta-ver-cert').val('')
        $('#btn-ver-new, #btn-ver-clear, #btn-ver-dl-cert').addClass('is-disabled')
        $('#ti-ver-regcode').removeClass('is-disabled')
    })

    //Download Buttons
    $('#btn-ver-dl-cert').on('click', function () {
        downloadFile('verification.pem', $('#ta-ver-cert').val())
    })

    //Registration Code
    $('#ti-ver-regcode').on('input', function () {
        let value = $(this).val().trim()
        if (!value) {
            //Empty
            $('#btn-ver-new, #btn-ver-clear').addClass('is-disabled')
        } else {
            //Value
            $('#btn-ver-new, #btn-ver-clear').removeClass('is-disabled')
        }
    })

    // ------------------
    // Device Certificate
    // ------------------
    //New Button
    $('#btn-dev-new').on('click', function () {
        $('#bi-dev-new').addClass('is-shown')
        $('#btn-dev-new, #ti-dev-name').addClass('is-disabled')
        //Cert
        let deviceName = $('#ti-dev-name').val().trim()
        let tenantKeyPem = $('#ta-ca-key').val()
        let tenantCertPem = $('#ta-ca-cert').val()
        let years = Number(localStorage.getItem('Device-Valid-Years'))
        let C = localStorage.getItem('C')
        let ST = localStorage.getItem('ST')
        let L = localStorage.getItem('L')
        let O = localStorage.getItem('O')
        let OU = localStorage.getItem('OU')
        genDeviceCertificate(deviceName, tenantKeyPem, tenantCertPem, years, C, ST, L, O, OU)
    })

    //Clear Button
    $('#btn-dev-clear, #btn-ca-clear').on('click', function () {
        $('#ti-dev-name').val('')
        $('#ta-dev-key').val('')
        $('#ta-dev-cert').val('')
        $('#btn-dev-new, #btn-dev-clear, #btn-dev-dl-cert').addClass('is-disabled')
        $('#ti-dev-name').removeClass('is-disabled')
    })

    //Download Buttons
    $('#btn-dev-dl-key').on('click', function () {
        let device = $('#ti-dev-name').val().trim()
        downloadFile(`${device}.key`, $('#ta-dev-key').val())
    })
    $('#btn-dev-dl-cert').on('click', function () {
        let device = $('#ti-dev-name').val().trim()
        downloadFile(`${device}.pem`, $('#ta-dev-cert').val())
    })

    //Device Name
    $('#ti-dev-name').on('input', function () {
        let value = $(this).val().trim()
        if (!value) {
            //Empty
            $('#btn-dev-new, #btn-dev-clear').addClass('is-disabled')
        } else {
            //Value
            $('#btn-dev-new, #btn-dev-clear').removeClass('is-disabled')
        }
    })
})
