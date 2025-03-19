import React from 'react';
import './membership.css';
import { Link } from 'react-router-dom';

const Membership = () => {
  return (
    <div class="membership-bg">
        <div className="membership-container">
        <h1 className="membership-title maintitle">MEMBERSHIP</h1>
        
        <div className="membership-boxes">
            <div className="membership-box welcome">
            <h2>WELCOME TO THE NATURE KINGDOM MEMBERSHIP!</h2>
            <p>Please check your dashboard or profile by logging in to the left for renewal dates, expiration dates, printing your membership card, review your membership, and check our great perks for friends and family.</p>
            
            <Link to="/login" className="signin-button">SIGN IN</Link>
            
            <p className="note">Want to know how to bond everyday? Get informed!</p>
            <p className="note">Start your first day by downloading the Member Dashboard on your mobile device for easy access to your membership card throughout your visit.</p>
            
            <p className="support-note">Thank you for supporting our mission to protect wildlife and the habitats needed as part of our Zoo!</p>
            
            <div className="help-section">
                <p>Need Help? Contact our Membership & Events at</p>
                <p>713-533-6500 or email us at membership@naturekingdom.org</p>
            </div>
            </div>

            <div className="membership-box join">
            <h2 style={{color: 'white'}}>NOT A MEMBER YET? JOIN TODAY!</h2>
            <div>
                <p>Enjoy unlimited visits for 12 months , exclusive perks, and special member-only events—all while supporting our mission to protect and care for wildlife.</p>
                <p> Whether you're a nature lover, an animal enthusiast, or a family looking for adventure, our membership option is for you.</p>    
            </div>
            <div className="promo-image">
                <img src="src\zoo_pictures\family_zoo_picture.jpg" alt="Family enjoying zoo visit" />
            </div>

            
            {/* needs to be changed to membership sign up page and not signup page */}
            <Link to="/signup" className="become-member-button">BECOME A MEMBER</Link>
            </div>
        </div>
        </div>
        <div className='membership-benefits'>
            <div className='membership-box benefits' >
                <div className="benefits-section">
                    <h3 className='membership-title'>Membership Benefits</h3>
                    <ul>
                    <li>Visit anytime—No reservations needed for members!</li>
                    <li>Early 12 months of free admission (excludes separately ticketed events)</li>
                    <li>10% discount at the Zoo Store—perfect for souvenirs and gifts</li>
                    <li>Exclusive savings on special events, guest visits, and Zoo experiences</li>
                    <li>Free subscription to our exclusive member newsletter and updates</li>
                    <li>Exclusive savings on special events, guest tickets, and unique experiences</li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
    
  );
};

export default Membership;
