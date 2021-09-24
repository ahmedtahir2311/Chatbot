import React from 'react';
import { Link }  from 'react-router-dom';

const Header = () =>(

    <nav style={{position:"relative", marginBottom:"60px"}}>
    <div className="" style={{backgroundColor:"#175071"}}>
    <Link to={'/'} className="brand-logo center"><img src="https://dealmania.shop/wp-content/uploads/2021/06/Official_logo_transparent-2-1.png" style={{width:"100px", height:"100px" }} alt="UAF LOGO"/></Link>
    </div>

    <div className="" style={{height:"110px",backgroundColor:"#175071"}}>
     
      <ul id="nav-mobile" className="left hide-on-med-and-down center">
        <li><Link to={'/'}>Home</Link></li>
        {/* <li><Link to={'/shop'}>Shop</Link></li> */}
        <li><Link to={'/about'}>About</Link></li>
      </ul>
    </div>
  </nav>
)



export default Header;