"use client";

import "./styles/tailwind.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./ui/Header";
import Footer from "./ui/Footer";

interface InvoiceForm {
  invoice_number: string;
  company_details: string;
  bill_to: string;
  company_logo: File | null;
  discount: number;
  tax: number;
  shipping_fee: number;
  notes: string;
  due_date: string;
}

interface ItemsForm {
  description: string;
  unit_cost: number;
  quantity: number;
}

const InvoiceGenerator: React.FC = () => {
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>({
    invoice_number: "",
    company_details: "",
    bill_to: "",
    company_logo: null,
    discount: 0,
    tax: 0,
    shipping_fee: 0,
    notes: "",
    due_date: "",
  });

  const [itemsForms, setItemsForms] = useState<ItemsForm[]>([
    { description: "", unit_cost: 0, quantity: 0 },
  ]);

  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    let t = 0;
    for (let i = 0; i < itemsForms.length; i++) {
      t += itemsForms[i].quantity * itemsForms[i].unit_cost;
    }
    t -= invoiceForm.discount;
    t += t * (invoiceForm.tax / 100.0);
    t += 1 * invoiceForm.shipping_fee;

    setTotal(t);
  };

  useEffect(() => {
    calculateTotal();
  }, [invoiceForm, itemsForms]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = event.target;

    if (index !== undefined) {
      // Update specific item form
      setItemsForms((prevForms) =>
        prevForms.map((form, i) =>
          i === index ? { ...form, [name]: value } : form
        )
      );
    } else {
      // Update invoice form
      setInvoiceForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setInvoiceForm((prevForm) => ({ ...prevForm, company_logo: file || null }));
  };

  const handleAddItemsForm = () => {
    setItemsForms((prevForms) => [
      ...prevForms,
      { description: "", unit_cost: 0, quantity: 0 },
    ]);
  };

  const handleSubmit = async () => {
    try {
      // Submit invoiceForm to "invoices" endpoint
      const invoiceResponse = await axios.post(
        process.env.NEXT_PUBLIC_CREATE_INVOICE_URL,
        invoiceForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (invoiceResponse.status === 201) {
        const invoiceId = invoiceResponse.data.id;
        const len = itemsForms.length;

        for (let i = 0; i < len; i++) {
          const itemObject = {
            invoice_id: invoiceId,
            ...itemsForms[i],
          };
          await axios.post(process.env.NEXT_PUBLIC_CREATE_ITEM_URL, itemObject);
        }
      }
      if (invoiceResponse.status === 201) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_GENERATE_INVOICE_URL}/?invoice_id=${invoiceResponse.data.id}`,
            {
              responseType: "arraybuffer", // Set the response type to arraybuffer to handle binary data
            }
          );

          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: "application/pdf" });

          // Create a link to download the PDF
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "generated_invoice.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting forms:", error);
    }
  };

  return (
    <>
      {<Header />}
      <div className="container mx-auto p-8">
        {/* Invoice Form */}
        <div className="container mx-auto p-8 flex flex-wrap -mx-2 justify-evenly">
          <div>
            <div className="mb-4 ">
              <label className="block text-sm font-semibold mb-1">
                Invoice Number:
              </label>
              <input
                type="text"
                name="invoice_number"
                value={invoiceForm.invoice_number}
                onChange={(e) => handleInputChange(e)}
                className="border text-black border-gray-300 rounded-md p-2 w-25"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Company Details:
              </label>
              <textarea
                name="company_details"
                value={invoiceForm.company_details}
                onChange={(e) => handleInputChange(e)}
                className="border text-black border-gray-300 rounded-md p-6"
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Company Logo:
              </label>
              <input
                type="file"
                name="company_logo"
                onChange={(e) => handleFileChange(e)}
                className="border text-black border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Bill To:
              </label>
              <textarea
                name="bill_to"
                value={invoiceForm.bill_to}
                onChange={(e) => handleInputChange(e)}
                className="border text-black border-gray-300 rounded-md p-6"
              />
            </div>
          </div>
        </div>
        {itemsForms.map((itemForm, index) => (
          <div
            key={index}
            className="container mx-auto ps-8 pe-8 flex flex-wrap -mx-2 justify-evenly"
          >
            {/* Items Form */}
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                Item description:
              </label>
              <input
                type="text"
                name="description"
                value={itemForm.description}
                onChange={(e) => handleInputChange(e, index)}
                className="border text-black border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                Unit Cost:
              </label>
              <input
                type="number"
                name="unit_cost"
                value={itemForm.unit_cost}
                onChange={(e) => handleInputChange(e, index)}
                className="border text-black border-gray-300 rounded-md p-2 "
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={itemForm.quantity}
                onChange={(e) => handleInputChange(e, index)}
                className="border text-black border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        ))}
        <div className="container mx-auto ps-8 pe-8 flex flex-wrap -mx-2 justify-center">
          <button
            onClick={handleAddItemsForm}
            className="bg-blue-500 text-white py-2 px-4 mb-4"
            style={{ backgroundColor: "#2c3e50" }}
          >
            Add another item
          </button>
        </div>
        <div>
          <div className="container mx-auto p-8 flex flex-wrap -mx-2 justify-evenly">
            <div className="mb-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Notes:
                </label>
                <textarea
                  name="notes"
                  value={invoiceForm.notes}
                  onChange={(e) => handleInputChange(e)}
                  className="border text-black border-gray-300 rounded-md p-4"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Due Date:
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={invoiceForm.due_date}
                  onChange={(e) => handleInputChange(e)}
                  className="border text-black border-gray-300 rounded-md p-2 "
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Discount:
                </label>
                <input
                  type="number"
                  name="discount"
                  value={invoiceForm.discount}
                  onChange={(e) => handleInputChange(e)}
                  className="border text-black border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Tax:</label>
                <input
                  type="number"
                  name="tax"
                  value={invoiceForm.tax}
                  onChange={(e) => handleInputChange(e)}
                  className="border text-black border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Shipping Fee:
                </label>
                <input
                  type="number"
                  name="shipping_fee"
                  value={invoiceForm.shipping_fee}
                  onChange={(e) => handleInputChange(e)}
                  className="border text-black border-gray-300 rounded-md p-2 "
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Total:</label>
              <input
                name="total"
                contentEditable="false"
                value={total}
                className="border text-black border-gray-300 rounded-md p-2 "
              />
            </div>
          </div>
        </div>
        <div className="container flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4"
            style={{ backgroundColor: "#2c3e50" }}
          >
            Generate Invoice
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InvoiceGenerator;
