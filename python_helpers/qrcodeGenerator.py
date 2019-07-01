import qrcode

def generator(ssid, pwd):

    qr = qrcode.QRCode(
        version = 1,
        error_correction = qrcode.constants.ERROR_CORRECT_H,
        box_size = 10,
        border = 4,
    )

    print(ssid, pwd)

    credentials = '"SSID":"{}", "password":"{}"'
    data = '{' + credentials.format(ssid, pwd) + '}'
    fileName = ssid + ".jpg"    

    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image()

    img.save(fileName)

with open('ssidList.txt', 'r') as f:
    ssidList = [line.rstrip() for line in f]
    f.close()

with open('passwordList.txt', 'r') as f:
    passwordList = [line.rstrip() for line in f]
    f.close()

for x in range(0, len(ssidList)):
    generator(ssidList[x], passwordList[x])

