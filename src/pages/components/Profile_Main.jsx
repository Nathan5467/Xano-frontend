import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../../API/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const decoded = jwtDecode(token);

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const [formdata, setFormdata] = useState({
    phoneNumber: "",
    branch: "",
    country: "",
    majority: "",
    id: "",
  });

  const [option, setOption] = useState(1);
  const [faq, setFaq] = useState(1);

  const saveAccount = async () => {
    setFormdata({ ...formdata, _id: decoded.id });
    if (!formdata.phoneNumber || !formdata.password) {
      toast.error("Please fill all the inputs");
    } else {
      await axios.post("/api/v1/registeragain", formdata);
      toast.success("Registration successful");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        {/* User Info Section */}
        <div className="row">
          <div className="col-4 align-self-center">
            <div className="media">
              <img
                src={decoded.avatar}
                alt="avatar"
                className="thumb-xl rounded-circle"
                style={{ width: "45px", height: "45px" }}
              />
              <div className="media-body align-self-center ms-3">
                <h5 className="fw-semibold mb-1 font-18">{decoded.name}</h5>
                <p className="mb-0 font-13">
                  {decoded.majority}, {decoded.country}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 ms-auto align-self-center">
            <ul className="list-unstyled personal-detail mb-0">
              <li>
                <i className="las la-phone text-secondary font-22 align-middle"></i>{" "}
                <b>Phone:</b> +{decoded.phoneNumber}
              </li>
              <li className="mt-2">
                <i className="las la-envelope text-secondary font-22 align-middle"></i>{" "}
                <b>Email:</b> {decoded.email}
              </li>
            </ul>
          </div>
          <div className="col-lg-4 align-self-center">
            <div className="row">
              <div className="col-auto text-end border-end">
                <button className="btn btn-soft-primary btn-icon-circle mb-2">
                  <i className="las la-dollar-sign font-20"></i>
                </button>
                <h4 className="mt-0 mb-1 fw-semibold">$95.37k</h4>
                <p className="mb-0 text-muted font-12 fw-normal">Current Value</p>
              </div>
              <div className="col-auto">
                <button className="btn btn-soft-success btn-icon-circle mb-2">
                  <i className="las la-hand-holding-usd font-20"></i>
                </button>
                <h4 className="mt-0 mb-1 fw-semibold">$32.51K/19.43K</h4>
                <p className="mb-0 text-muted font-12 fw-normal text-center">
                  Profit / Loss
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="accordion mt-3" id="accordionSettings">
          {/* Bank Accounts Section */}
          <div className="accordion-item">
            <h2 className="accordion-header mt-0" id="bankAC">
              <button
                onClick={() => setOption(1)}
                className={`accordion-button font-14 ${
                  option === 1 ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#settingOne"
                aria-expanded={option === 1}
                aria-controls="settingOne"
              >
                Bank Accounts Linked
              </button>
            </h2>
            <div
              id="settingOne"
              className={`accordion-collapse collapse ${
                option === 1 ? "show" : ""
              }`}
              aria-labelledby="bankAC"
              data-bs-parent="#accordionSettings"
            >
              <div className="accordion-body">
                <div className="border rounded">
                  <div className="bg-light d-flex justify-content-between">
                    <h5 className="m-0 font-15 p-3">
                      <img
                        src="boa.png"
                        alt="US bank"
                        height="20"
                        className="me-1"
                      />
                      Bank of America
                    </h5>
                    <div className="align-self-center me-3">
                      <button className="btn btn-sm btn-primary">Edit</button>
                      <button className="btn btn-sm btn-primary">Add Bank</button>
                    </div>
                  </div>
                  <div className="row p-3">
                    <div className="col-4">
                      <h6 className="m-0">Account Number</h6>
                      <p className="mb-0">{decoded.bank}</p>
                    </div>
                    <div className="col-4">
                      <h6 className="m-0">IFSC Code</h6>
                      <p className="mb-0">COLI000521</p>
                    </div>
                    <div className="col-4">
                      <h6 className="m-0">Branch</h6>
                      <p className="mb-0">
                        {decoded.branch} {decoded.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Section */}
          <div className="accordion-item">
            <h2 className="accordion-header mt-0" id="General">
              <button
                onClick={() => setOption(5)}
                className={`accordion-button font-14 ${
                  option === 5 ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#settingFive"
                aria-expanded={option === 5}
                aria-controls="settingFive"
              >
                General
              </button>
            </h2>
            <div
              id="settingFive"
              className={`accordion-collapse collapse ${
                option === 5 ? "show" : ""
              }`}
              aria-labelledby="General"
              data-bs-parent="#accordionSettings"
            >
              <div className="accordion-body">
                <h5 className="mt-0 font-13">Change User Information</h5>
                <form className="row g-3">
                  <div className="col-12">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={decoded.country}
                      onChange={(e) =>
                        setFormdata({ ...formdata, country: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={decoded.majority}
                      onChange={(e) =>
                        setFormdata({ ...formdata, majority: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={decoded.branch}
                      onChange={(e) =>
                        setFormdata({ ...formdata, branch: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <input
                      className="form-control"
                      type="text"
                      placeholder={decoded.phoneNumber}
                      onChange={(e) =>
                        setFormdata({ ...formdata, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={saveAccount}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="accordion-item">
            <h2 className="accordion-header mt-0" id="FAQs">
              <button
                onClick={() => setOption(6)}
                className={`accordion-button font-14 ${
                  option === 6 ? "" : "collapsed"
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#settingSix"
                aria-expanded={option === 6}
                aria-controls="settingSix"
              >
                FAQs
              </button>
            </h2>
            <div
              id="settingSix"
              className={`accordion-collapse collapse ${
                option === 6 ? "show" : ""
              }`}
              aria-labelledby="FAQs"
              data-bs-parent="#accordionSettings"
            >
              <div className="accordion-body">
                <div className="accordion" id="accordionFAQs">
                  {/* FAQ Items */}
                  {[1, 2, 3].map((faqIndex) => (
                    <div className="accordion-item" key={faqIndex}>
                      <h2 className="accordion-header m-0" id={`faqs${faqIndex}`}>
                        <button
                          onClick={() => setFaq(faqIndex)}
                          className={`accordion-button ${
                            faq === faqIndex ? "" : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faqs_${faqIndex}`}
                          aria-expanded={faq === faqIndex}
                          aria-controls={`faqs_${faqIndex}`}
                        >
                          {faqIndex === 1
                            ? "Can I trade without a stockbroker?"
                            : faqIndex === 2
                            ? "Can I trade when markets are closed or shut down?"
                            : "How can I track my stock portfolio?"}
                        </button>
                      </h2>
                      <div
                        id={`faqs_${faqIndex}`}
                        className={`accordion-collapse collapse ${
                          faq === faqIndex ? "show" : ""
                        }`}
                        aria-labelledby={`faqs${faqIndex}`}
                        data-bs-parent="#accordionFAQs"
                      >
                        <div className="accordion-body">
                          {faqIndex === 1
                            ? "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
                            : faqIndex === 2
                            ? "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
                            : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
