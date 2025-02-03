import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedInstrument } from "../redux/slices/instrumentsSlice";

export const useLiveInstrument = (symbol) => {
  const dispatch = useDispatch();
  const selectedInstrument = useSelector(
    (state) => state.instruments.selectedInstrument
  );
  const loading = useSelector((state) => state.instruments.loading);
  const priceColors = useSelector((state) => state.instruments.priceColors);

  useEffect(() => {
    dispatch(setSelectedInstrument(symbol));
  }, [symbol, dispatch]);

  return {
    instrument: selectedInstrument,
    loading,
    priceColor: selectedInstrument
      ? priceColors[selectedInstrument._id]
      : "#333",
  };
};
