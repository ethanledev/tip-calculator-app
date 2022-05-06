import styles from "./App.module.css";
import { ReactComponent as Logo } from "../images/logo.svg";
import { useState } from "react";

const TIP_OPTIONS = [5, 10, 15, 25, 50];

const App = () => {
  const [bill, setBill] = useState("0");
  const [tipOption, setTipOption] = useState("CUSTOM");
  const [customTip, setCustomTip] = useState("");
  const [numPeople, setNumPeople] = useState("");

  const reset = () => {
    setBill("0");
    setTipOption("CUSTOM");
    setCustomTip("");
    setNumPeople("");
  };

  const formatAmount = (num) => {
    const [wholeNumPart, fractionalPart] = num.toString().split(".");
    if (fractionalPart) {
      if (fractionalPart.length === 1) {
        return "$" + wholeNumPart + "." + fractionalPart + "0";
      } else {
        return "$" + num.toString();
      }
    } else {
      return "$" + wholeNumPart + ".00";
    }
  };

  const calculateAmount = (isTip) => {
    if (bill > 0 && numPeople !== "" && numPeople > 0) {
      //calculate tip ratio
      let tipRatio = 0;
      if (tipOption === "CUSTOM") {
        if (customTip !== "") {
          tipRatio = customTip / 100;
        }
      } else {
        tipRatio = tipOption / 100;
      }

      //calculate tip amount per person
      const tipAmount = Math.round(((bill * tipRatio) / numPeople) * 100) / 100;
      //calculat total amount per person
      const totalAmount =
        Math.round((bill / numPeople + tipAmount) * 100) / 100;

      console.log({ tipRatio, tipAmount, totalAmount });

      if (isTip) {
        return formatAmount(tipAmount);
      } else {
        return formatAmount(totalAmount);
      }
    } else {
      return formatAmount(0);
    }
  };

  const handleInputChange = (value, isIntegerOnly, setState) => {
    const regex = new RegExp(/^\d+$/);
    const newInput = value[value.length - 1];

    if (newInput === undefined) {
      if (setState === setCustomTip) {
        setState("");
      } else {
        setState("0");
      }
      return;
    }

    if (newInput === ".") {
      if (isIntegerOnly) {
        //integer only field doesn't accept "."
        return;
      } else if (
        //there is a "." in the field already
        value.indexOf(".") > -1 &&
        value.indexOf(".") < value.length - 1
      ) {
        return;
      }
      setState(value);
      return;
    }

    //check if new input is a number
    if (regex.test(newInput)) {
      setState(Number(value).toString());
    }
  };

  const placeCursorAtTheEnd = (id, value) => {
    const end = value.length;
    const input = document.getElementById(id);
    input.focus();
    input.setSelectionRange(end, end);
  };

  const renderTipOptions = () => {
    const options = TIP_OPTIONS.map((option) => (
      <span
        key={option}
        className={`${styles.tipOption} ${
          tipOption === option ? styles.tipActive : null
        }`}
        onClick={() => setTipOption(option)}
      >
        {option}%
      </span>
    ));

    options.push(
      <div key="custom tip" className={styles.inputContainer}>
        <input
          id="customTip"
          type="text"
          className={`${styles.input} ${
            tipOption === "CUSTOM" ? styles.customTipActive : null
          }`}
          placeholder="Custom"
          value={customTip}
          autoComplete="off"
          onChange={(e) =>
            handleInputChange(e.target.value, false, setCustomTip)
          }
          onClick={() => {
            placeCursorAtTheEnd("customTip", customTip);
            setTipOption("CUSTOM");
          }}
        />
      </div>
    );

    return options;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.srOnly}>Splitter</h1>
      <Logo />
      <main>
        <div className={styles.inputBox}>
          <div className={styles.inputField}>
            <label className={styles.label} htmlFor="bill">
              Bill
            </label>
            <div className={styles.inputContainer} id={styles.billInput}>
              <input
                type="text"
                id="bill"
                className={styles.input}
                value={bill}
                autoComplete="off"
                onChange={(e) =>
                  handleInputChange(e.target.value, false, setBill)
                }
                onClick={() => placeCursorAtTheEnd("bill", bill)}
              />
            </div>
          </div>
          <div className={styles.inputField}>
            <span className={styles.label}>Select Tip %</span>
            <div className={styles.tipTable}>{renderTipOptions()}</div>
          </div>
          <div className={styles.inputField}>
            <div className={styles.labelContainer}>
              <label htmlFor="numPeople" className={styles.label}>
                Number of People
              </label>
              <span>{numPeople === "0" ? "Can't be zero" : ""}</span>
            </div>
            <div className={styles.inputContainer} id={styles.numPeopleInput}>
              <input
                type="text"
                id="numPeople"
                className={`${styles.input} ${
                  numPeople === "0" ? styles.error : null
                }`}
                value={numPeople}
                autoComplete="off"
                onChange={(e) =>
                  handleInputChange(e.target.value, true, setNumPeople)
                }
                onClick={() => placeCursorAtTheEnd("numPeople", numPeople)}
              />
            </div>
          </div>
        </div>
        <div className={styles.outputBox}>
          <div className={styles.output}>
            <span className={styles.title}>
              <span>Tip Amount</span>
              <span>/ person</span>
            </span>
            <span className={styles.amount}>{calculateAmount(true)}</span>
          </div>
          <div className={styles.output}>
            <span className={styles.title}>
              <span>Total</span>
              <span>/ person</span>
            </span>
            <span className={styles.amount}>{calculateAmount(false)}</span>
          </div>
          <div className={styles.button} onClick={reset}>
            Reset
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
