import React, { useEffect, useState } from 'react';
import { NativeBaseProvider, extendTheme, StatusBar } from 'native-base';
// import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Home } from './src/Pages/Home';
import { IMarkedDate } from './src/components/Calendar';
import { AsynStorageEnum } from './src/enums/AsyncStorage.enum';

const theme = extendTheme({});

// SplashScreen.preventAutoHideAsync();

export interface IPreviousData {
  initialDate: string;
  period: string;
  daysJob: IMarkedDate;
}

export default function App() {
  const [previusData, setPreviusData] = useState<IPreviousData>(
    {} as IPreviousData,
  );

  useEffect(() => {
    (async function loadPrevious() {
      const value = await AsyncStorage.getItem(AsynStorageEnum.lastSimulatio);
      if (value) {
        const { initialDate, daysJob, period } = JSON.parse(
          value,
        ) as IPreviousData;
        setPreviusData({
          initialDate,
          daysJob,
          period,
        });
      }
      // await SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Home previousData={previusData} />
    </NativeBaseProvider>
  );
}
