import React from "react";
import styles from "../styles/Footer.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.invoiceImageContainer}>
        <p
          className="block text-sm font-semibold mb-1"
          style={{ textAlign: "center" }}
        >
          Sample Invoice
        </p>
        <img
          src="/sample-invoice1.png"
          alt="Sample Invoice"
          className={styles.invoiceImage}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.icons}>
          <p style={{ paddingRight: "10px" }}>Find me on:</p>
          <a
            href="https://github.com/tangent24-hash"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className={styles.icon} />
          </a>
          <a
            href="https://linkedin.com/in/sohanur1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className={styles.icon} />
          </a>
        </div>
        <p
          className={styles.text}
          style={{ width: "30%", paddingBottom: "20px" }}
        >
          This invoice generator web application is built using Next.js in the
          Frontend and Django in the Backend. You can find this project source code
          in{" "}
          <a
            href="https://github.com/tangent24-hash"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "buttontext" }}
          >
            GitHub
          </a>
        </p>
        <p className={styles.text}>
          © {new Date().getFullYear()} Invoice Generator. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
