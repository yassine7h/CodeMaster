import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

export const useHttpErrorHandler = () => {
   const { enqueueSnackbar } = useSnackbar();

   const handleHttpError = useCallback(
      (error: any) => {
         const errMessage = error?.response?.data ? JSON.stringify(error.response.data) : 'An unexpected error occurred';
         enqueueSnackbar(errMessage, { variant: 'error' });
      },
      [enqueueSnackbar]
   );

   return handleHttpError;
};
