import {
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  KeyboardAvoidingView,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AntDesign } from '@expo/vector-icons';
import {
  addDays,
  addMonths,
  addYears,
  format,
  isBefore,
  parse,
  endOfMonth,
} from 'date-fns';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarComponent, IMarkedDate } from '../../components/Calendar';
import { AsynStorageEnum } from '../../enums/AsyncStorage.enum';
import { IPreviousData } from '../../../App';

interface IHomeProps {
  previousData: IPreviousData;
}

export function Home({ previousData }: IHomeProps) {
  const { colors } = useTheme();
  const dayNowFormatted = format(new Date(), 'dd/MM/yyyy');
  const startLimitData = new Date();
  const endLimitData = addMonths(new Date(), 11);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateStart, setDateStart] = useState(dayNowFormatted);
  const [dayOfJobs, setDayOfJobs] = useState('');
  const [selectedDays, setSelectedDays] = useState<IMarkedDate>({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const dateFormatted = format(date, 'dd/MM/yyyy');
    setDateStart(dateFormatted);
    hideDatePicker();
  };

  const handleCalculateDaysOfJob = async () => {
    const dateStartParsed = parse(dateStart, 'dd/MM/yyyy', new Date());

    let currentDate = dateStartParsed;
    let isPeriodoJob = true;

    let currentPeriod = Number(dayOfJobs);

    const endLooping = addYears(endOfMonth(dateStartParsed), 1);

    const daysJob: IMarkedDate = {};

    while (isBefore(currentDate, endLooping)) {
      if (isPeriodoJob) {
        const formmatDateOBJ = format(currentDate, 'yyyy-MM-dd');
        daysJob[formmatDateOBJ] = {
          selected: true,
          selectedColor: colors.primary['400'],
        };
      }

      currentPeriod -= 1;
      if (currentPeriod === 0) {
        isPeriodoJob = !isPeriodoJob;
        currentPeriod = Number(dayOfJobs);
      }
      currentDate = addDays(currentDate, 1);
    }
    await AsyncStorage.setItem(
      AsynStorageEnum.lastSimulatio,
      JSON.stringify({
        initialDate: dateStart,
        period: dayOfJobs,
        daysJob,
      }),
    );
    setSelectedDays(daysJob);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if(Object.keys(previousData).length){
      setDateStart(previousData.initialDate);
      setDayOfJobs(previousData.period);
      setSelectedDays(previousData.daysJob);
    }
  }, [previousData]);

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack mx="8" flex={1}>
          <HStack w="full" justifyContent="center" pt={20}>
            <Heading size="2xl">Scale Job 📅</Heading>
          </HStack>
          <HStack alignItems="center" mt={6}>
            <Text
              borderColor="red"
              p={2}
              flex={1}
              mr={4}
              borderWidth={2}
              borderRadius="5"
              textAlign="center"
              fontSize="lg"
              onPress={showDatePicker}
            >
              {dateStart}
            </Text>
            <HStack space={4} alignItems="center">
              <IconButton
                colorScheme="primary"
                size="lg"
                variant="outline"
                onPress={showDatePicker}
                _icon={{
                  as: AntDesign,
                  name: 'calendar',
                }}
              />
            </HStack>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={startLimitData}
              maximumDate={endLimitData}
            />
          </HStack>
          <HStack>
            <Input
              mt={4}
              size="2xl"
              bg="white"
              borderColor="black"
              borderWidth={2}
              placeholder="Sequência de dias trabalhados"
              p={2}
              px={4}
              flex={1}
              value={dayOfJobs}
              onChangeText={setDayOfJobs}
              keyboardType="number-pad"
              _focus={{
                borderColor: 'black',
                backgroundColor: 'white',
              }}
            />
          </HStack>
          <Button
            variant="subtle"
            opacity={1}
            bgColor="primary.500"
            isDisabled={!dateStart || !dayOfJobs}
            _disabled={{ opacity: 0.7 }}
            _text={{
              color: 'white',
              fontWeight: 'semibold',
              textTransform: 'uppercase',
              letterSpacing: 1.25,
            }}
            size="lg"
            mt={6}
            mb={12}
            endIcon={
              <Icon as={AntDesign} color="white" name="calculator" size="lg" />
            }
            onPress={handleCalculateDaysOfJob}
          >
            Calcular
          </Button>
          <VStack>
            <CalendarComponent selectedDays={selectedDays} />
          </VStack>
        </VStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
