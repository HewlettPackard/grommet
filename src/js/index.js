// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP
var Grommet = {
  // Components
  Accordion: require('./components/Accordion'),
  AccordionPanel: require('./components/AccordionPanel'),
  Anchor: require('./components/Anchor'),
  Animate: require('./components/Animate'),
  App: require('./components/App'),
  Article: require('./components/Article'),
  Box: require('./components/Box'),
  Button: require('./components/Button'),
  Card: require('./components/Card'),
  Carousel: require('./components/Carousel'),
  chart: {
    Area: require('./components/chart/Area'),
    Axis: require('./components/chart/Axis'),
    Bar: require('./components/chart/Bar'),
    Base: require('./components/chart/Base'),
    Chart: require('./components/chart/Chart'),
    Grid: require('./components/chart/Grid'),
    HotSpots: require('./components/chart/HotSpots'),
    Layers: require('./components/chart/Layers'),
    Line: require('./components/chart/Line'),
    Marker: require('./components/chart/Marker'),
    MarkerLabel: require('./components/chart/MarkerLabel'),
    Range: require('./components/chart/Range')
  },
  CheckBox: require('./components/CheckBox'),
  Collapsible: require('./components/Collapsible'),
  Columns: require('./components/Columns'),
  DateTime: require('./components/DateTime'),
  DateTimeDrop: require('./components/DateTimeDrop'),
  Distribution: require('./components/Distribution'),
  Footer: require('./components/Footer'),
  Form: require('./components/Form'),
  FormattedMessage: require('./components/FormattedMessage'),
  FormField: require('./components/FormField'),
  FormFields: require('./components/FormFields'),
  Grommet: require('./components/Grommet'),
  Header: require('./components/Header'),
  Heading: require('./components/Heading'),
  Headline: require('./components/Headline'),
  Hero: require('./components/Hero'),
  Image: require('./components/Image'),
  Label: require('./components/Label'),
  Layer: require('./components/Layer'),
  Legend: require('./components/Legend'),
  List: require('./components/List'),
  ListItem: require('./components/ListItem'),
  LoginForm: require('./components/LoginForm'),
  Map: require('./components/Map'),
  Markdown: require('./components/Markdown'),
  Menu: require('./components/Menu'),
  Meter: require('./components/Meter'),
  Notification: require('./components/Notification'),
  NumberInput: require('./components/NumberInput'),
  Object: require('./components/Object'),
  Paragraph: require('./components/Paragraph'),
  Quote: require('./components/Quote'),
  RadioButton: require('./components/RadioButton'),
  Search: require('./components/Search'),
  SearchInput: require('./components/SearchInput'),
  Section: require('./components/Section'),
  Select: require('./components/Select'),
  Sidebar: require('./components/Sidebar'),
  SkipLinkAnchor: require('./components/SkipLinkAnchor'),
  SkipLinks: require('./components/SkipLinks'),
  SocialShare: require('./components/SocialShare'),
  Split: require('./components/Split'),
  SunBurst: require('./components/SunBurst'),
  SVGIcon: require('./components/SVGIcon'),
  Tab: require('./components/Tab'),
  Table: require('./components/Table'),
  TableRow: require('./components/TableRow'),
  Tabs: require('./components/Tabs'),
  TBD: require('./components/TBD'),
  TextInput: require('./components/TextInput'),
  Tile: require('./components/Tile'),
  Tiles: require('./components/Tiles'),
  Timestamp: require('./components/Timestamp'),
  Tip: require('./components/Tip'),
  Title: require('./components/Title'),
  Toast: require('./components/Toast'),
  Topology: require('./components/Topology'),
  Value: require('./components/Value'),
  Video: require('./components/Video'),
  WorldMap: require('./components/WorldMap'),
  Icons: {
    Grommet: require('./components/icons/Grommet'),
    Pulse: require('./components/icons/Pulse'),
    Spinning: require('./components/icons/Spinning'),
    Status: require('./components/icons/Status'),
    Base: require('./index-icons')
  },
  // Utils
  Cookies: require('./utils/Cookies'),
  DOM: require('./utils/DOM'),
  KeyboardAccelerators: require('./utils/KeyboardAccelerators'),
  Locale: require('./utils/Locale'),
  Rest: require('./utils/Rest'),
  Validator: require('./utils/Validator')
};

module.exports = Grommet;
