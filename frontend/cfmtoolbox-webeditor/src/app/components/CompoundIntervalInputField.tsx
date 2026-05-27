import { useState } from "react";
import { CompoundInterval, Interval } from "../types/FeatureModel";

class CompoundIntervalParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CompoundIntervalParseError';
        Object.setPrototypeOf(this, CompoundIntervalParseError.prototype);
    }
}

interface CompoundIntervalInputProps {
    compoundInterval: CompoundInterval
    setCompoundInterval: React.Dispatch<React.SetStateAction<CompoundInterval>>
    setCompoundIntervalParseError?: React.Dispatch<React.SetStateAction<boolean>>
}

function compoundIntervalToText(compoundInterval: CompoundInterval) {
    return compoundInterval?.map((interval: Interval) => {
        return "[" + interval.lower + "," + interval.upper + "]";
    }).join("")
}

function parseCompoundInterval(text: string): CompoundInterval {
    if (text === "") return [];

    text = text.replaceAll(/^\[|\]$/g, ''); // Remove leading and trailing interval brackets
    const singleIntervalTexts: string[] = text.split("]["); // Split between each interval

    return singleIntervalTexts.map((intervalText) => {
        const minMaxPair = intervalText.split(","); // Split number pair inside each interval
        const min = minMaxPair[0];
        const max = minMaxPair[1];

        // Check if input is valid
        // !( min && !max ==> max==*)
        if (!(Number.isInteger(Number(min)) && (Number.isInteger(Number(max)) || max === "*"))
            || min === "" || max === "") {
            console.log(minMaxPair);
            throw new CompoundIntervalParseError("Error parsing " + minMaxPair);
        }

        return {
            lower: min,
            upper: max
        }
  });
}

export default function CompoundIntervalInput({
    compoundInterval,
    setCompoundInterval,
    setCompoundIntervalParseError,
}: Readonly<CompoundIntervalInputProps>) {
    const [compoundIntervalText, setCompoundIntervalText] = useState(compoundIntervalToText(compoundInterval));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompoundIntervalText(e.target.value);
        try {
            const intervals = parseCompoundInterval(e.target.value);
            setCompoundInterval(intervals);
            if (setCompoundIntervalParseError) setCompoundIntervalParseError(false);
        } catch (error) {
            if (error instanceof CompoundIntervalParseError) {
                console.log(error.message);
                if (setCompoundIntervalParseError) setCompoundIntervalParseError(true);
            } else {
                throw error;
            }
        }
    };

    return (
        <input
            type="text"
            className="feature-modal__input"
            placeholder="[1,2][4,6][9,*]"
            value={compoundIntervalText}
            onChange={handleChange}
        />
    )
}
