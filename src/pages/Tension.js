
import Page from 'components/Page';
import ImportExport from '@material-ui/icons/ImportExport';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import React from "react";
import tension from "assets/animations/tensionResize.gif"

import {
  MdShowChart,
  MdCloudUpload,
} from 'react-icons/md';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  FormGroup,
  Input,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import { getColor } from 'utils/colors';
import Typography from 'components/Typography';
//--------------FOR XSL EXPORT-----------------
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
//-----------------------DIALOG CONTAINER----------------
import TextField from '@material-ui/core/TextField';
//++++++++++++++++++++++++++++IMPORTING CAMNVAS JS++++++++++++++
import CanvasJSReact from 'assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
//---------------------------------------------

const dataToPlot=[];
var intervalReadingControllino;
var graphIntervalReadings;


class DashboardPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      stateConnection:null,
      stateButtonEncerar:false,
      stateButtonIniciar:true,
      stateButtonDetener:true,
      stateButtonExportar:true,
      dataToExport:[],
      //dataToExport:[{e:12,p:123},{e:12431243,p:22},{e:235423,p:677}],  ///testing export
      ext:0,
      pressu:0,
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: true,
      initial_deformation:0,
      initial_pressure:0,
      tittleCSV:''
    };
  }
  
  
  componentDidMount() {
    
    this.callBackendAPI()
    .then(res => this.setState({ stateConnection: res.express }))
    .catch(err => console.log(err));
    console.log('RESPONSE FROM SERVER ')
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }else{
      this.connectToControllino();
    }
    return body;
};
//-----------------read SERVER data FUNCTION------------
connectToControllino=()=>{
  fetch('/connectToControllino')
  .then(res=>res.json())
  .then(res=>this.setState({stateConnection:res.noti}))
  console.log(this.stateConnection)
  intervalReadingControllino= setInterval(() => {
      this.getInitialDatafromControllino();
      
    }, 250);
  }
//---------------getting the initial data from  controllino for set to zero
getInitialDatafromControllino=()=>{
  const {initial_deformation}=this.state;
  const {initial_pressure}=this.state;
  fetch('/values')
  .then(res=>res.json())
  .then(res=>this.setState({initial_deformation:res.extValue,initial_pressure:res.pressValue}));
  this.setState({pressu:initial_pressure});
  this.setState({ext:initial_deformation});
}
//--------------------setting to zero sensor values---------------
setToZero=()=>{
  fetch('/setToZero')
  // .then(res=>res.json())
  // .then(res=>this.setState({initial_deformation:res.extValue,initial_pressure:res.pressValue}));
}
//start de readigs and updates values
getDataGraph=()=>{
  const {ext}=this.state;
  const {pressu}=this.state;
  const {dataToExport}=this.state;
  // fetch('/values')
  // .then(res=>res.json())
  // .then(res=>this.setState({ext:res.extValue,pressu:res.pressValue}));

  dataToExport.push({Carga:pressu,Deformación:ext});
  this.setState({dataToExport});
  dataToPlot.push({x: ext,y: pressu});
}

  //!!!!!!!!!!!!!!STOP LECTURES!!!!!!!!!!!!!!!!!!!!!!!!!!
  serverStopReadings=()=>{
    fetch('/stopReadigsControllino')
    .then(res=>res.json())
    .then(res=>this.setState({stateConnection:res.response}));
    clearInterval(intervalReadingControllino);
    console.log('HA TERMINADO LA LECTURA EN CLIENTE');
    
  }
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //-------------------EXPORT TO XSL FUNCTION-------------------
  exportToCSV = (csvData, fileName) => {
    console.log(csvData);
    console.log(fileName);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(data, fileName + fileExtension);
  }
//---------------------------------------------------//
//'''''''''''''''''''''MODAL'''''''''''''
toggle = modalType => () => {
  if (!modalType) {
    return this.setState({
      modal: !this.state.modal,
    });
  }

  this.setState({
    [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
  });
};
toggleANDsave=modalType=>()=>{
  console.log("tittle  "+this.state.tittleCSV)
  this.exportToCSV(this.state.dataToExport,this.state.tittleCSV);
  if (!modalType) {
    return this.setState({
      modal: !this.state.modal,
    });
  }

  this.setState({
    [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
  });
}
// //----------------------test get tect field--------------//
handleChange=(e)=>this.setState({tittleCSV:e.target.value})
//-------------------------------------------------------//
//----------------------------------------------------
//^^^^^^^^^^^^^^^^^^^^^^BUTTONS HANDLING ENABLE STATE^^^^^^^^^^^^^^^^^^^^^^^
  encerarButtonAction=()=>{
    this.setToZero();
    this.setState({stateButtonEncerar:true});
    this.setState({stateButtonIniciar:false});
    this.setState({stateButtonDetener:true});
    this.setState({stateButtonExportar:true});
    
  }
  iniciarButtonAction=()=>{
    this.setState({stateButtonEncerar:true});
    this.setState({stateButtonIniciar:true});
    this.setState({stateButtonDetener:false});
    this.setState({stateButtonExportar:true});
    graphIntervalReadings= setInterval(() => {
      this.getDataGraph();
      
    }, 250);
    
  }
  detenerButtonAction=()=>{
    this.setState({stateButtonEncerar:true});
    this.setState({stateButtonIniciar:false});
    this.setState({stateButtonDetener:true});
    this.setState({stateButtonExportar:false});
    this.serverStopReadings();
  }
  exportarButtonAction=()=>{
    this.setState({stateButtonEncerar:false});
    this.setState({stateButtonIniciar:true});
    this.setState({stateButtonDetener:true});
    this.setState({stateButtonExportar:true});
  }
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');
    const gray= getColor('gray-dark');
    const {tittleCSV}=this.state;
    const optionsR = {
      zoomEnabled: true,
      title :{
        text: ""
      },
      axisY:{
        title:'CARGA',
      },
      axisX:{
        title:'DEFORMACION',
      },
      height:490,
      data: [{
        type: "line",
        dataPoints : dataToPlot
      }]
    }
    return (
      <div>
          <Page
        className="DashboardPage"
        title="Experimento"
        // breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
          <Col lg="10" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                GRAFICA DE CARGA VS DEFORMACIÓN
                {/* <small className="text-muted text-capitalize">This year</small> */}
              </CardHeader>
              <CardBody>
                  <CanvasJSChart options = {optionsR} />
              </CardBody>
            </Card>
          </Col>

          <Col lg="2" md="12" sm="12" xs="12">
            <Row>
              <Col sm="12">
              <Card>
                <CardHeader>CONTROL</CardHeader>
                <ListGroup flush>
                  <ListGroupItem>
                      <Typography className="text-success">{this.state.stateConnection}</Typography>
                  </ListGroupItem>
                  <ListGroupItem>
                    <MdShowChart size={25} color={primaryColor} /><Button onClick={this.iniciarButtonAction} disabled={this.state.stateButtonIniciar} color="primary">INICIAR</Button>
                  </ListGroupItem>
                  <ListGroupItem>
                  <PauseCircleOutlineIcon color="primary"></PauseCircleOutlineIcon><Button onClick={this.detenerButtonAction} disabled={this.state.stateButtonDetener} color="primary">DETENER</Button>
                  </ListGroupItem>
                  <ListGroupItem>
                  <MdCloudUpload size={20} color={primaryColor} /><Button size="sm" onClick={this.toggle()} disabled={this.state.stateButtonExportar} color="primary">EXPORTAR XSL</Button>
                    <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle()}
                    className={this.props.className}>
                    <ModalHeader toggle={this.toggle()}>Exportar Datos</ModalHeader>
                    <ModalBody>
                      <TextField name="tittle" required id="standard-required" label="Nombre del Archivo" value={this.tittleCSV}
                            onChange={this.handleChange}/>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggleANDsave()}>
                        Guardar
                      </Button>{' '}
                      <Button color="secondary" onClick={this.toggle()}>
                        Cancelar
                      </Button>
                    </ModalFooter>
                  </Modal>
                  </ListGroupItem>
                </ListGroup>
              </Card>
              </Col>
             
            </Row>
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>tension</CardHeader>
                </Card>
                <CardBody>
                  <Col sm={6}><img src={tension}></img> </Col>
                  
                </CardBody>
              </Col>
             
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg="10" md="12" sm="12" xs="12">
              <Card>
                <CardHeader>Configuración Inicial</CardHeader>
                <CardBody>
                    <Form>
                      <FormGroup row>
                        <Label sm={2}>
                          <strong>CARGA INICIAL</strong>
                        </Label>
                        <Label sm={2}>
                          {this.state.initial_pressure}
                        </Label>
                        <Label  sm={2}>
                        <strong>POS. INICIAL</strong>
                        </Label>
                        <Label sm={2}>
                          {this.state.initial_deformation}
                        </Label>
                        <Button onClick={this.encerarButtonAction} disabled={this.state.stateButtonEncerar} sm={2}>ENCERAR MEDICION</Button>
                      </FormGroup>
                    </Form>
                </CardBody>
              </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>Carga Pico</CardHeader>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={7}>1992093</Label>
                    <Label><strong>lbf</strong></Label>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>

      </div>
        
    );
  }
}
export default DashboardPage;
