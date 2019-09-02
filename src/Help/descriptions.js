export const descriptions = [
  [
    {
      title: 'Checklist when the app\'s scanner doesn\'t work:',
      header_1: '1. Make sure you have granted camera permission.',
      text_1: 'The app should have prompted you to answer permission dialogue. If you have declined to grant permission for the use of camera, you would not be able to use the scanner. If you want to change this setting, check your mobile device\'s Settings. If you want to keep this setting, you have to manually enter your EMERALD device\'s SSID and password.',
      header_2: '2. Check your device\'s API version',
      text_2: 'Some mobile devices may have outdated APIs that are not supported by the libraries that have been used in this app. In this case, try updating your device to the most recently released version of OS. If the scanner still doesn\'t work, you would need to manually enter your device\'s SSID and password.'
    },
    {
      title: 'Where is my EMERALD device\'s QR code',
      text_1: 'You should be able to find a QR code attached to the bottom of your EMERALD device, next to where you have plugged in the power cable to. If the QR code was detached from the device for any reason, you would need to enter device SSID and password manually. You only have to do this once to complete registration.' ,
    }
  ],
  [
    {
      title: 'Webview not loaded (in Manage)',
      header_1: '1. Not connected to the EMERALD device network',
      text_1: 'Webview, which is the screen that appears after scanning the QR code (in Connect tab), will not be loaded if your mobile device is not connected to your EMERALD device\'s network. Make sure you click on \'reload\' at the bottom of the screen and if still nothing appears, check the name of wireless network that your device is connected to. If the network SSID doesn\'t start with emerald, you are not connected to your EMERALD device.'
    }
  ],
  [
    {
      title: 'Cannot add device to home',
      header_1: '1. Device already registered',
      text_1: 'You would not be able to add device to a home if the device has already been registered a different home. Check other homes to make sure that you are not trying to add the same device to multiple homes.',
    }
  ]
]
