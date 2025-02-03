import { useState, useEffect, useRef, useCallback } from "react";

export const useInstruments = (socket, serverUrl, instrumentId = null) => {
  const [instruments, setInstruments] = useState(instrumentId ? null : []);
  const [singleInstrument, setSingleInstrument] = useState(
    instrumentId ? null : undefined
  );
  const [loading, setLoading] = useState(true);
  const [priceColors, setPriceColors] = useState({});
  const timeoutsRef = useRef({});
  const lastColorRef = useRef({});

  const updatePriceColor = useCallback(
    (instrumentId, newPrice, previousPrice) => {
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

      setPriceColors((prevColors) => ({
        ...prevColors,
        [instrumentId]: newColor,
      }));

      timeoutsRef.current[instrumentId] = setTimeout(() => {
        setPriceColors((prevColors) => ({
          ...prevColors,
          [instrumentId]: "#333",
        }));
      }, 1000);
    },
    []
  );

  // Fetch instruments or single instrument
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data from:", serverUrl);
        const endpoint = instrumentId
          ? `${serverUrl}/instrument/${instrumentId}`
          : `${serverUrl}/instrument`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (instrumentId) {
          setSingleInstrument(data);
        } else {
          setInstruments(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(timeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      lastColorRef.current = {};
    };
  }, [serverUrl, instrumentId]);

  // Handle real-time price updates
  useEffect(() => {
    if (!socket) return;

    const handlePriceUpdates = ({ action, updates }) => {
      if (action === "update") {
        updates.forEach((update) => {
          // Check if this update is for our specific instrument or all instruments
          const shouldUpdate = instrumentId ? update.id === instrumentId : true;

          if (shouldUpdate) {
            if (instrumentId) {
              // Update single instrument
              setSingleInstrument((prev) => {
                if (!prev) return prev;

                const prevPrice = prev.price;

                if (update.price !== prevPrice) {
                  lastColorRef.current[prev._id] =
                    update.price > prevPrice ? "#4CAF50" : "#FF5252";
                }

                updatePriceColor(prev._id, update.price, prevPrice);

                return {
                  ...prev,
                  price: update.price,
                  lastUpdate: update.timestamp,
                };
              });
            } else {
              // Update multiple instruments
              setInstruments((prev) => {
                const updatedInstruments = [...prev];
                const index = updatedInstruments.findIndex(
                  (inst) => inst._id === update.id
                );

                if (index !== -1) {
                  const prevPrice = updatedInstruments[index].price;

                  if (update.price !== prevPrice) {
                    lastColorRef.current[update.id] =
                      update.price > prevPrice ? "#4CAF50" : "#FF5252";
                  }

                  updatePriceColor(update.id, update.price, prevPrice);

                  updatedInstruments[index] = {
                    ...updatedInstruments[index],
                    price: update.price,
                    lastUpdate: update.timestamp,
                  };
                }

                return updatedInstruments;
              });
            }
          }
        });
      }
    };

    socket.on("priceUpdates", handlePriceUpdates);

    // If instrumentId is provided, request specific instrument updates
    if (instrumentId && socket.connected) {
      socket.emit("subscribeInstrument", { symbol: instrumentId });
    }

    return () => {
      socket.off("priceUpdates", handlePriceUpdates);

      // Unsubscribe from specific instrument if applicable
      if (instrumentId && socket.connected) {
        socket.emit("unsubscribeInstrument", { symbol: instrumentId });
      }
    };
  }, [socket, instrumentId, updatePriceColor]);

  return {
    instruments: instrumentId ? singleInstrument : instruments,
    loading,
    priceColors,
    instrument: instrumentId ? singleInstrument : null,
  };
};
