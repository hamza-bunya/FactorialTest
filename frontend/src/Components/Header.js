import React from "react";
import {SearchOutlined} from '@ant-design/icons';

const Header = (props) => {

    const {placeholder, onChange, value} = props;

    return (
      <div className="gx-module-box-header-inner">
        <div
          className="gx-search-bar gx-lt-icon-search-bar-lg gx-module-search-bar gx-d-none gx-d-sm-block">
          <div className="gx-form-group">
            <input className="ant-input gx-border-0" type="search" placeholder={placeholder} onChange={onChange} value={value}
                   />
            <span className="gx-search-icon gx-pointer"><SearchOutlined /></span>
          </div>
        </div>
      </div>
    )
};

export default Header;

Header.defaultProps = {
  styleName: '',
  value: '',
  notification: true,
  apps: true
};
