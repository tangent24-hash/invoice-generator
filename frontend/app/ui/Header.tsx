// components/Header.tsx

import React from "react";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const title = "Welcome to the Invoice Generator";
  const tagline =
    "Elevate your invoicing with our Invoice Generator! Easily craft professional invoices in seconds, simplifying your financial management with style and ease. Begin now for a more intuitive billing experience!";

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.headline}>{title}</h1>
        <div className={styles.taglines}>
          <p>{tagline}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
