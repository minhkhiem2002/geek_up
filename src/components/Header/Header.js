import "./Header.scss";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import Logo from "../../assets/geekup_logo.svg";
const Header = () => {
  return (
    <>
      <Row gutter={16} className="header">
        <Col className="gutter-row" span={3}>
          <Row>
            <Col className="gutter-gutter-row" span={24}>
              <Link to="/" className="style-linka">
                <img
                  src={Logo}
                  width="auto"
                  height="32"
                  alt="Logo"
                  className="logoImage"
                />
                <h1
                  className="header-test"
                  style={{
                    color: "rgba(0, 0, 0, 0.88)",
                    fontWeight: "600",
                    fontSize: "16px",
                    marginTop: "10px"
                  }}
                >
                  Test
                </h1>
              </Link>
            </Col>
          </Row>
        </Col>
        <Col className="gutter-row" span={1}>
          <Link to="/todo" className="style-linkb">
            <h1
              className="header-todo"
              style={{
                color: "#1677ff",
                fontSize: "14px",
                fontWeight: "400",
                backgroundColor: "transparent",
                marginTop: "10px"
              }}
            >
              To do
            </h1>
          </Link>
        </Col>
      </Row>
    </>
  );
};
export default Header;
