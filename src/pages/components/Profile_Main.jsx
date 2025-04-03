// src/pages/components/Profile_Main.jsx
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../../API/axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import { FaUser, FaPhone, FaEnvelope, FaDollarSign, FaHandHoldingUsd } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

// Styled Components
const ProfileCard = styled.div`
  background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
`;

const UserInfoSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#404040' : '#e9ecef'};
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${props => props.isDarkMode ? '#404040' : '#e9ecef'};
`;

const StyledAccordion = styled.div`
  .accordion-button {
    background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#f8f9fa'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    
    &:not(.collapsed) {
      background-color: ${props => props.isDarkMode ? '#4d4d4d' : '#e9ecef'};
    }
  }

  .accordion-body {
    background-color: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
`;

const StyledInput = styled.input`
  background-color: ${props => props.isDarkMode ? '#3d3d3d' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  border: 1px solid ${props => props.isDarkMode ? '#404040' : '#ced4da'};
  
  &:focus {
    background-color: ${props => props.isDarkMode ? '#4d4d4d' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
`;

const EditButton = styled(Button)`
  background-color: ${props => props.isDarkMode ? '#4d4d4d' : '#007bff'};
  border-color: ${props => props.isDarkMode ? '#4d4d4d' : '#007bff'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#5d5d5d' : '#0056b3'};
    border-color: ${props => props.isDarkMode ? '#5d5d5d' : '#0056b3'};
  }
`;

const SaveButton = styled(Button)`
  background-color: ${props => props.isDarkMode ? '#28a745' : '#28a745'};
  border-color: ${props => props.isDarkMode ? '#28a745' : '#28a745'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isDarkMode ? '#218838' : '#218838'};
    border-color: ${props => props.isDarkMode ? '#218838' : '#218838'};
  }
`;
const useAuth = () => {
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      const decoded = jwtDecode(token);
      return { token: JSON.parse(token), decoded };
    }
    return { token: "", decoded: null };
  });

  const updateAuth = (newToken) => {
    localStorage.setItem("auth", JSON.stringify(newToken));
    setAuthData({
      token: newToken,
      decoded: jwtDecode(newToken)
    });
  };

  return { ...authData, updateAuth };
};
const Profile = () => {
  const { isDarkMode } = useTheme();
  const { token, decoded, updateAuth } = useAuth();
  // const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  // const decoded = jwtDecode(token);

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // State management
  const [bankData, setBankData] = useState({
    bank: decoded.bank || "",
    IFSC_Code: decoded.IFSC_Code || "",
  });

  const [formdata, setFormdata] = useState({
    name: decoded.name || "",
    phoneNumber: decoded.phoneNumber || "",
    branch: decoded.branch || "",
    country: decoded.country || "",
    majority: decoded.majority || "",
  });

  const [option, setOption] = useState(1);
  const [faq, setFaq] = useState(1);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle bank details update
  const handleBankEdit = () => {
    setBankData({
      bank: decoded.bank || "",
      IFSC_Code: decoded.IFSC_Code || ""
    });
    setIsEditingBank(true);
  };

  const handleBankCancel = () => {
    setIsEditingBank(false);
    setBankData({
      bank: decoded.bank || "",
      IFSC_Code: decoded.IFSC_Code || ""
    });
  };

  const handleBankSave = async () => {
    if (isSubmitting) return;

    try {
      // Validation
      setIsSubmitting(true);
      setLoading(true);
      
      const response = await axios.put(`/api/v1/updateUser/${decoded.id}`, {
        ...bankData,
      });

      if (response.status === 200) {
        toast.success("Updated successfully! \n\
          If you want to link your bank account, please re-login now.");
        setIsEditingBank(false);
        
        if (response.data.token) {

          updateAuth(response.data.token);
          setBankData(prev => ({
            ...prev,
            ...jwtDecode(response.data.token)
          }));
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update bank details");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Handle user details update
  const saveAccount = async () => {
    if (loading) return;
    try {
      setLoading(true);
      
      const response = await axios.post("/api/v1/registeragain", {
        ...formdata,
        id: decoded._id,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        if (response.data.token) {
          updateAuth(response.data.token);
          setFormdata(prev => ({
            ...prev,
            ...jwtDecode(response.data.token)
          }));
        }
      }
    } catch (error) {
      // console.error('Save error:', error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update states when token changes
    const currentToken = JSON.parse(localStorage.getItem("auth"));
    if (currentToken) {
      const decodedToken = jwtDecode(currentToken);
      setFormdata({
        name: decodedToken.name || "",
        phoneNumber: decodedToken.phoneNumber || "",
        branch: decodedToken.branch || "",
        country: decodedToken.country || "",
        majority: decodedToken.majority || "",
      });
      setBankData({
        bank: decodedToken.bank || "",
        IFSC_Code: decodedToken.IFSC_Code || "",
      });
    }
  }, []);

  return (
    <ProfileCard isDarkMode={isDarkMode}>
      {/* User Info Section */}
      <UserInfoSection isDarkMode={isDarkMode}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <Avatar 
                src={decoded.avatar || 'default-avatar.png'} 
                alt={decoded.name}
                isDarkMode={isDarkMode}
              />
              <div className="ms-4">
                <h4 className="mb-1 text-center" style={{ color: '#C0C0C0' }}>{decoded.name}</h4>
                <p className="mb-0">
                  {decoded.majority}, <span className="text-info">{decoded.country}</span>
                </p>
              </div>
              <div className="user-contact ms-4">
                <div className="d-flex align-items-center mb-2">
                  <FaPhone className="me-2" />
                  <span>{decoded.phoneNumber}</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaEnvelope className="me-2" />
                  <span>{decoded.email}</span>
                </div>
              </div>
            </div>            
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-6 border-end">
                <div className="text-center">
                  <FaDollarSign className="mb-2" size={24} />
                  <h5 className="mb-1">$0.00k</h5>
                  <p className="mb-0 text-muted">Current Value</p>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <FaHandHoldingUsd className="mb-2" size={24} />
                  <h5 className="mb-1">$0.00K</h5>
                  <p className="mb-0 text-muted">Profit/Loss</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserInfoSection>

      {/* Accordion Sections */}
      <StyledAccordion className="accordion" id="profileAccordion" isDarkMode={isDarkMode}>
        {/* Bank Account Section */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${option !== 1 && 'collapsed'}`}
              onClick={() => setOption(1)}
              type="button"
            >
              Bank Accounts
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${option === 1 ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="border rounded p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <img src="boa.png" alt="Bank" height="24" className="me-2" />
                    Bank Details
                  </h5>
                  {isEditingBank ? (
                    <div className="d-flex gap-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={handleBankCancel}
                      >
                        Cancel
                      </Button>
                      <SaveButton
                        size="sm"
                        onClick={handleBankSave}
                        disabled={loading}
                        isDarkMode={isDarkMode}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </SaveButton>
                    </div>
                  ) : (
                    <EditButton
                      size="sm"
                      onClick={handleBankEdit}
                      isDarkMode={isDarkMode}
                    >
                      Edit
                    </EditButton>
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Account Number</label>
                    {isEditingBank ? (
                      <StyledInput
                        type="text"
                        className="form-control"
                        value={bankData.bank}
                        onChange={(e) => setBankData({...bankData, bank: e.target.value})}
                        isDarkMode={isDarkMode}
                      />
                    ) : (
                      <p className="mb-0">{decoded.bank || 'Not set'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">IFSC Code</label>
                    {isEditingBank ? (
                      <StyledInput
                        type="text"
                        className="form-control"
                        value={bankData.IFSC_Code}
                        onChange={(e) => setBankData({...bankData, IFSC_Code: e.target.value})}
                        isDarkMode={isDarkMode}
                      />
                    ) : (
                      <p className="mb-0">{decoded.IFSC_Code || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Information Section */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${option !== 2 && 'collapsed'}`}
              onClick={() => setOption(2)}
              type="button"
            >
              General Information
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${option === 2 ? 'show' : ''}`}>
            <div className="accordion-body">
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={formdata.name}
                    onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={formdata.country}
                    onChange={(e) => setFormdata({ ...formdata, country: e.target.value })}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Majority</label>
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={formdata.majority}
                    onChange={(e) => setFormdata({ ...formdata, majority: e.target.value })}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Branch</label>
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={formdata.branch}
                    onChange={(e) => setFormdata({ ...formdata, branch: e.target.value })}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={formdata.phoneNumber}
                    onChange={(e) => setFormdata({ ...formdata, phoneNumber: e.target.value })}
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="col-12">
                  <SaveButton
                    type="button"
                    onClick={saveAccount}
                    disabled={loading || isSubmitting}
                    isDarkMode={isDarkMode}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </SaveButton>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${option !== 3 && 'collapsed'}`}
              onClick={() => setOption(3)}
              type="button"
            >
              FAQs
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${option === 3 ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="accordion" id="faqAccordion">
                {[
                  {
                    question: "Can I trade without a stockbroker?",
                    answer: `You can trade without a stockbroker by using online trading platforms\
                     and brokerage accounts that allow self-directed trading.\n\
                     Many platforms provide the tools and resources needed for you\
                     to buy and sell stocks, ETFs, and other securities independently.\n\
                     This approach gives you greater control over your investments\
                     and often comes with lower fees compared to traditional brokerage services.\
                     However, it's important to conduct thorough research\
                     and have a solid understanding of the market before diving in.\n\
                     Make sure to evaluate your investment strategy, risk tolerance,\
                     and stay informed about market trends to make informed decisions.\n\
                     If you have any further questions or need assistance\
                     in exploring trading platforms, feel free to reach out!`
                  },
                  {
                    question: "Can I trade when markets are closed?",
                    answer: "Yes, you can trade when markets are closed through after-hours trading\
                     or pre-market trading sessions offered by some brokerages.\
                     However, keep in mind that these sessions may have limited liquidity\
                     and wider spreads, which could affect your trades."
                  },
                  {
                    question: "How can I track my stock portfolio?",
                    answer: "To effectively track your stock portfolio, consider the following methods:\n\n	1. **Use a Stock Tracking App**: There are many apps available, such as Robinhood, E*TRADE, or Seeking Alpha, that allow you to input your portfolio and track its performance in real-time. \n\n	2. **Spreadsheet**: Create a simple spreadsheet using Excel or Google Sheets. Input your stock symbols, number of shares, and purchase prices. Calculate the current value using real-time stock prices from websites like Yahoo Finance or Google Finance.\n\n	3. **Brokerage Dashboard**: If you have an account with a brokerage firm, they typically offer tools and dashboards to track your investments. Log in to your account and explore the available features.\n\n	4. **Financial News Websites**: Websites like Yahoo Finance, MarketWatch, or Bloomberg provide tools for tracking stock performance. You can create a watchlist for your stocks to monitor their updates. \n\n	5. **Set Alerts**: Many platforms allow you to set alerts for price changes, news updates, or significant changes in your stocks. This can help you stay informed about your portfolio.\n\n	6. **Review Periodically**: Regularly review your portfolio's performance and consider rebalancing if necessary to align with your investment goals.\n\n	By using these methods, you can stay on top of your investments and make informed decisions."
                  }
                ].map((faqItem, index) => (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${faq !== index + 1 && 'collapsed'}`}
                        onClick={() => setFaq(index + 1)}
                        type="button"
                      >
                        {faqItem.question}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${faq === index + 1 ? 'show' : ''}`}>
                      <div className="accordion-body">
                        {faqItem.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </StyledAccordion>
    </ProfileCard>
  );
};

export default Profile;
