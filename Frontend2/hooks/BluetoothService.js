import { BleManager } from 'react-native-ble-plx';
import { useEffect, useState } from 'react';

export default function useHeartRateBluetooth() {
  const [bpm, setBpm] = useState(null);
  const manager = new BleManager();

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);

    return () => {
      manager.destroy();
    };
  }, []);

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Scan error:', error);
        return;
      }

      if (device.name === 'ESP32_HeartRate') {
        manager.stopDeviceScan();
        device.connect()
          .then((device) => device.discoverAllServicesAndCharacteristics())
          .then((device) => {
            return device.monitorCharacteristicForService(
              '12345678-1234-1234-1234-1234567890ab',
              'abcd1234-abcd-1234-abcd-1234567890ab',
              (error, characteristic) => {
                if (error) {
                  console.error('Monitor error:', error);
                  return;
                }

                const value = characteristic?.value;
                if (value) {
                  const decoded = atob(value); // Base64 decode
                  const parsed = parseInt(decoded);
                  setBpm(parsed);
                }
              }
            );
          });
      }
    });
  };

  return bpm;
}
