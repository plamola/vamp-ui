var React = require('react');
var classNames = require('classnames');
var _ = require('underscore');
var LoadStates = require("../../constants/LoadStates");
var DeploymentActions = require('../../actions/DeploymentActions');
var DeploymentStore = require('../../stores/DeploymentStore');

var AddArtefactBox = React.createClass({

  // Etc
  contextTypes: {
    router: React.PropTypes.func
  },
  clearStates: {
    deploymentRaw: '',
    errorMessage: '',
    editArtefact: false,
    dirty: false,
    buttonLoadsate: false
  },

  // Component lifecylce
  getInitialState: function(){
    return {
      deploymentRaw: '',
      errorMessage: '',
      dirty: false,
      editArtefact: false,
      buttonLoadsate: false
    };
  },
  componentWillReceiveProps: function(nextProps) {    
    // Close toolbar and clear state when deployment is cleared from store
    if(!this.props.deploymentAsBlueprint && this.props.toolbarState == 'expanded' ){
      this.clearComponentState();
    }

    // Open toolbar and fill state when deployment is fetched
    if(this.props.deploymentAsBlueprint && this.props.toolbarState != 'expanded' && !this.state.editArtefact){
      this.setState({ 
        deploymentRaw: this.props.deploymentAsBlueprint,
        editArtefact: true,
        dirty: true,
        buttonLoadsate: false
      });
      this.props.setToolbar('expanded');
    }
  },
  componentWillMount: function() {
    this.clearComponentState = _.debounce(this.clearComponentState,200, true);
  },
  componentDidMount: function(){
    this._initArtefactFunctions();
  },
  componentWillUnmount: function(){
    this.handleCancel();
    this._destroyArtefactFunctions();
  },

  // Event handlers
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  handleCancel: function(e){
    if(e)
      e.preventDefault();
    DeploymentStore.clearCurrentAsBlueprint();
    this.setState(this.clearStates);
    this.props.setToolbar('');
    this.props.clearDetailArtefact();
  },
  handleTextareaChange: function(e){
    this.setState({deploymentRaw: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();

    this.setState({ 
      errorMessage: '',
      buttonLoadsate: true,
    });
    DeploymentActions.updateDeployment(this.context.router.getCurrentParams().id, this.state.deploymentRaw, 'application/x-yaml');
  },

  // Helper methods
  clearComponentState: function(){
    this.props.setToolbar('');
    this.setState(this.clearStates);
    React.findDOMNode(this.refs.AddNewForm).reset(); 
  },

  // Render
  render: function() {

    // Get formatted deployment ID
    var params = this.context.router.getCurrentParams();

    // Setup dynamic classes
    var dialogClasses = classNames({
      'dialog': true,
      'dialog-danger': true,
      'dialog-empty': this.state.errorMessage == '' ? true : false
    });
    var saveButtonClasses = classNames({
      "active": this.state.buttonLoadsate,
      "button": true,
      "button-pink": true,
      "save-button": true
    });

    return(
      <form className='edit-deployment-box' onSubmit={this.handleSubmit} ref='AddNewForm'>
        <h2>Edit deployment</h2>
        <p>Deployment ID: {React.addons.createFragment(params)}</p>
        <div className='actions'>
          <button className="button button-ghost cancel-button" onClick={this.handleCancel}>Cancel</button>
          <input type='submit' className={saveButtonClasses} value='Save' />
        </div>
        <p className={dialogClasses}>{this.state.errorMessage}</p>
        <textarea className='inputfield' ref="inputfield" value={this.state.deploymentRaw} onChange={this.handleTextareaChange} rows='15'></textarea>
      </form>
  )},

  _onChange: function() {
    var errorMessage = this._getErrorMessage();

    if(errorMessage)
      this.setState({ errorMessage: errorMessage, buttonLoadsate: false });
  },

  _initArtefactFunctions: function(){
    DeploymentStore.addChangeListener(this._onChange);
  },
  _destroyArtefactFunctions: function(){
    DeploymentStore.removeChangeListener(this._onChange);
  },
  _getErrorMessage: function(){
    return DeploymentStore.getError();
  }  

});
 
module.exports = AddArtefactBox;