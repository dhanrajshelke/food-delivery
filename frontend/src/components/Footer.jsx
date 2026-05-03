import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>🍕 FoodDelivery &copy; {new Date().getFullYear()} All rights reserved.</span>
        <span>Contact: <a href="tel:9834166516">9834166516</a></span>
      </div>
    </footer>
  )
}
