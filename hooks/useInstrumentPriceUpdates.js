import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePrices, setPriceColor } from "../redux/slices/instrumentsSlice";

export const useInstrumentPriceUpdates = (socket) => {
  const dispatch = useDispatch();
  const timeoutsRef = useRef({});
  const lastColorRef = useRef({});

  const updatePriceColor = (instrumentId, newPrice, previousPrice) => {
    if (timeoutsRef.current[instrumentId]) {
      clearTimeout(timeoutsRef.current[instrumentId]);
    }

    let newColor;
    if (!lastColorRef.current[instrumentId]) {
      newColor = newPrice >= previousPrice ? "#4CAF50" : "#FF5252";
    } else {
      newColor = lastColorRef.current[instrumentId];
    }

    lastColorRef.current[instrumentId] = newColor;
    dispatch(setPriceColor({ instrumentId, color: newColor }));

    timeoutsRef.current[instrumentId] = setTimeout(() => {
      dispatch(setPriceColor({ instrumentId, color: "#333" }));
    }, 1000);
  };

  useEffect(() => {
    if (!socket) return;

    const handlePriceUpdates = ({ action, updates }) => {
      if (action === "update") {
        updates.forEach((update) => {
          const prevPrice = useSelector(
            (state) =>
              state.instruments.instruments.find(
                (inst) => inst._id === update.id
              )?.price
          );

          if (update.price !== prevPrice) {
            lastColorRef.current[update.id] =
              update.price > prevPrice ? "#4CAF50" : "#FF5252";
          }

          updatePriceColor(update.id, update.price, prevPrice);
        });

        dispatch(updatePrices({ updates }));
      }
    };

    socket.on("priceUpdates", handlePriceUpdates);

    return () => {
      socket.off("priceUpdates", handlePriceUpdates);
      Object.values(timeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      lastColorRef.current = {};
    };
  }, [socket, dispatch]);
};
