import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayOrder, setOrder } from '../redux/reducers/reducers';

const OrderAndDisplaySide = () => {
    const dispatch = useDispatch();

    const isRandomOrder = useSelector((state) => state.flashcards.isRandomOrder);
    const isFrontDisplayed = useSelector(
      (state) => state.flashcards.isFrontDisplayed
    );
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-2 mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden toggle-checkbox"
                checked={isRandomOrder}
                onChange={() => dispatch(setOrder(!isRandomOrder))}
              />
              <div
                className={`relative w-10 h-6 bg-gray-300 rounded-full transition-colors ${
                  isRandomOrder ? "bg-green-400" : "bg-gray-200"
                } `}
              >
                <div
                  className={`absolute left-1 transition-transform duration-300 ease-in-out h-1 w-4 pt-4 mt-1 bg-white rounded-full  ${
                    isRandomOrder ? "transform translate-x-full pt-4 mt-1" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-2 font-abel">Random Order</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="hidden toggle-checkbox"
                checked={isFrontDisplayed}
                onChange={() => dispatch(setDisplayOrder(!isFrontDisplayed))}
              />
              <div
                className={`relative w-10 h-6 bg-gray-300 rounded-full transition-colors ${
                  isFrontDisplayed ? "bg-green-400" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute left-1 transition-transform duration-300 ease-in-out h-1 w-4 pt-4 mt-1 bg-white rounded-full ${
                    isFrontDisplayed ? "transform translate-x-full pt-4 mt-1" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-2 font-abel">Random Side</span>
            </label>
          </div>
        </div>
    );
};

export default OrderAndDisplaySide;