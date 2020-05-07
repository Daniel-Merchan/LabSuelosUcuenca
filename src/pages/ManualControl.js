import React from 'react';
import mask from 'assets/img/mask.png';

import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardSubtitle,
  Form,
  Label,
  FormGroup,
  CardBody,
  CardText,
} from 'reactstrap';

import Page from 'components/Page';




class ButtonPage extends React.Component {
  state = {
    rSelected: null,
    cSelected: [],
  };


  render() {
    return (
      <Page
      >

        <Row>
          <Col md="6" sm="12" xs="12">
          <Card>
            <CardHeader>CONTROL DE MOTOR</CardHeader>
            <CardBody>
               
                <Row>
                  <Col sm="1" md={{ size: 8, offset: 4 }}> 
                    <Form>
                      <FormGroup>
                        <Button outline color="info" className="mr-1" size="lg" sm={2}>
                          Arriba
                        </Button>
                         <Label sm={2}>0</Label>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <Row>
                <Col sm="12" md={{ size: 8, offset: 4 }}>
                <Button outline color="info" className="mr-1" size="lg">
                    Abajo 
                  </Button>
                  </Col>
                
                </Row>
            </CardBody>
          </Card>
          </Col>

          <Col md="6" sm="12" xs="12">
            <Card className="mb-3">
              <CardHeader>CONTROL DE BOMBA</CardHeader>
              <CardBody>
              <Row>
                  <Col sm="12" md={{ size: 8, offset: 4 }}> 
                    <Form>
                      <FormGroup>
                        <Button outline color="success" className="mr-1" size="lg" sm={2}>
                          Encender 
                        </Button>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <Row>
                <Col sm="12" md={{ size: 8, offset: 4 }}>
                <Button outline color="danger" className="mr-1" size="lg">
                    Apagar
                  </Button>
                  </Col>
                
                </Row>
            </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default ButtonPage;
