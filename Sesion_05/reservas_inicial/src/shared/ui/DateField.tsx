import { useState, useEffect } from "react";
import { getShortDate } from "../util";

interface DateFieldProps {
    label: string;
    value?: string;
    min?: string;
    onChange: (value: string) => void;
}

function DateField({ label, value, min, onChange }: DateFieldProps) {
    let inputValue = value || min || getShortDate();
    const [inValue, setInValue] = useState(inputValue);
    
    useEffect(() => {
        onChange(inValue);
    }, [inValue]);

    return ( 
        <div className="campo">
            <label className="campo__etiqueta">{label}</label>
            <input type="date" className="campo__input" value={inValue} min={min}
            onChange={(e) => setInValue(e.target.value)} />
        </div> 
    );
}

export default DateField;