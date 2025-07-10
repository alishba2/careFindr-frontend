import React from 'react';
import { Input } from '../input';

const NumericInput = ({ 
    value, 
    onChange, 
    placeholder = "Enter number", 
    className = "", 
    min = "0",
    max,
    allowDecimals = false,
    ...props 
}) => {
    const handleChange = (e) => {
        let inputValue = e.target.value;
        
        // If decimals are allowed, preserve decimal points
        if (allowDecimals) {
            // Allow only numbers and one decimal point
            inputValue = inputValue.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = inputValue.split('.');
            if (parts.length > 2) {
                inputValue = parts[0] + '.' + parts.slice(1).join('');
            }
        } else {
            // Allow only integers
            inputValue = inputValue.replace(/[^0-9]/g, '');
        }
        
        // Apply min/max constraints if provided
        if (min !== undefined && inputValue !== '' && parseInt(inputValue) < parseInt(min)) {
            inputValue = min;
        }
        if (max !== undefined && inputValue !== '' && parseInt(inputValue) > parseInt(max)) {
            inputValue = max;
        }
        
        onChange(inputValue);
    };

    const handleKeyDown = (e) => {
        // Allow: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right arrow keys
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        
        // Allow decimal point if decimals are allowed
        if (allowDecimals && e.keyCode === 190 && value.indexOf('.') === -1) {
            return;
        }
        
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        
        let numericValue;
        if (allowDecimals) {
            // Allow numbers and decimal point
            numericValue = paste.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const parts = numericValue.split('.');
            if (parts.length > 2) {
                numericValue = parts[0] + '.' + parts.slice(1).join('');
            }
        } else {
            // Allow only integers
            numericValue = paste.replace(/[^0-9]/g, '');
        }
        
        onChange(numericValue);
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            className={className}
            min={min}
            max={max}
            {...props}
        />
    );
};

export default NumericInput;
