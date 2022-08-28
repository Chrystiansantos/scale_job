import { endOfMonth, isAfter, isBefore, parse, startOfMonth } from 'date-fns';
import { addMonths } from 'date-fns/esm';
import { useTheme } from 'native-base';
import React, { useState } from 'react';

import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan.',
    'Fev.',
    'Mar.',
    'Abr.',
    'Mai.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Set.',
    'Out.',
    'Nov.',
    'Dez.',
  ],
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sabado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

export interface IMarkedDate {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

interface ICalendarComponentProps {
  selectedDays: IMarkedDate;
}

export function CalendarComponent({ selectedDays }: ICalendarComponentProps) {
  const { colors } = useTheme();
  const [disableArrowLeft, setDisableArrowLeft] = useState(false);
  const [disableArrowRight, setDisableArrowRight] = useState(false);

  let initialDataCallendar = '';
  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
  for (const key in selectedDays) {
    initialDataCallendar = key;
    break;
  }

  return (
    <Calendar
      initialDate={initialDataCallendar}
      disableArrowLeft={disableArrowLeft}
      disableArrowRight={disableArrowRight}
      monthFormat="MMMM yyyy"
      hideExtraDays
      firstDay={1}
      onPressArrowLeft={subtractMonth => subtractMonth()}
      onPressArrowRight={addMonth => addMonth()}
      onMonthChange={date => {
        if (
          isBefore(
            startOfMonth(parse(date.dateString, 'yyyy-MM-dd', new Date())),
            new Date(),
          )
        ) {
          setDisableArrowLeft(true);
        } else {
          setDisableArrowLeft(false);
        }
        if (
          isAfter(
            startOfMonth(parse(date.dateString, 'yyyy-MM-dd', new Date())),
            endOfMonth(addMonths(new Date(), 11)),
          )
        ) {
          setDisableArrowRight(true);
        } else {
          setDisableArrowRight(false);
        }
      }}
      enableSwipeMonths
      markedDates={selectedDays}
      theme={{
        textSectionTitleColor: colors.gray['800'],
        todayTextColor: colors.gray['800'],
        dayTextColor: colors.gray['800'],
        arrowColor: colors.primary['400'],
        disabledArrowColor: 'transparent',
        monthTextColor: colors.primary['400'],
        indicatorColor: colors.primary['400'],
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '600',
      }}
    />
  );
}
