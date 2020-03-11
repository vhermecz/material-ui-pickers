import * as React from 'react';
import { arrayIncludes } from '../../_helpers/utils';
import { MaterialUiPickersDate } from '../../typings/date';
import { AnyPickerView } from '../../Picker/WithViewsProps';

export type PickerOnChangeFn = (date: MaterialUiPickersDate, isFinish?: boolean | symbol) => void;

export function useViews({
  views,
  openTo,
  onChange,
  isMobileKeyboardViewOpen,
  toggleMobileKeyboardView,
}: {
  views: AnyPickerView[];
  openTo: AnyPickerView;
  onChange: PickerOnChangeFn;
  isMobileKeyboardViewOpen: boolean;
  toggleMobileKeyboardView: () => void;
}) {
  const [openView, _setOpenView] = React.useState(
    openTo && arrayIncludes(views, openTo) ? openTo : views[0]
  );

  const setOpenView = React.useCallback(
    (...args: Parameters<typeof _setOpenView>) => {
      if (isMobileKeyboardViewOpen) {
        toggleMobileKeyboardView();
      }

      _setOpenView(...args);
    },
    [isMobileKeyboardViewOpen, toggleMobileKeyboardView]
  );

  const previousView = views[views.indexOf(openView!) - 1];
  const nextView = views[views.indexOf(openView!) + 1];
  const openNext = React.useCallback(() => {
    if (nextView) {
      setOpenView(nextView);
    }
  }, [nextView, setOpenView]);

  const handleChangeAndOpenNext = React.useCallback(
    (date: MaterialUiPickersDate, isFinishedSelectionInCurrentView?: boolean | symbol) => {
      onChange(date, Boolean(nextView) ? false : isFinishedSelectionInCurrentView);

      if (isFinishedSelectionInCurrentView) {
        openNext();
      }
    },
    [nextView, onChange, openNext]
  );

  return {
    nextView,
    previousView,
    openNext,
    handleChangeAndOpenNext,
    openView,
    setOpenView,
  };
}
