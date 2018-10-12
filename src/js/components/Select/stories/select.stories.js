import React, { createRef, Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import { FormClose } from 'grommet-icons';

import {
  Box,
  Button,
  CheckBox,
  Grommet,
  Select,
  Text,
} from 'grommet';
import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

import { theme as customSearchTheme } from './theme';
import { SearchInputContext } from './components/SearchInputContext';

const customRoundedTheme = deepMerge(
  grommet,
  {
    global: {
      control: {
        border: {
          radius: '24px',
        },
      },
      input: {
        weight: 400,
      },
      font: {
        size: '12px',
      },
    },
    text: {
      medium: '13px',
    },
    textInput: {
      extend: 'padding: 0 12px;',
    },
    select: {
      control: {
        extend: 'padding: 3px 6px;',
      },
    },
  }
);

class SimpleSelect extends Component {
  propTypes = {
    theme: PropTypes.shape({}).isRequired,
  }

  state = {
    options: ['one', 'two'],
    value: '',
  }

  render() {
    const { theme } = this.props;
    const { options, value } = this.state;
    return (
      <Grommet theme={theme || grommet}>
        <Select
          id='select'
          name='select'
          placeholder='Select'
          value={value}
          options={options}
          onChange={({ option }) => this.setState({ value: option })}
        />
      </Grommet>
    );
  }
}

const DEFAULT_OPTIONS = [];
for (let i = 1; i <= 200; i += 1) DEFAULT_OPTIONS.push(`option ${i}`);

class SearchSelect extends Component {
  state = {
    options: DEFAULT_OPTIONS,
    value: '',
  }

  render() {
    const { options, value } = this.state;
    return (
      <Grommet theme={grommet}>
        <Select
          size='medium'
          placeholder='Select'
          value={value}
          options={options}
          onChange={({ option }) => this.setState({ value: option })}
          onClose={() => this.setState({ options: DEFAULT_OPTIONS })}
          onSearch={(text) => {
            const exp = new RegExp(text, 'i');
            this.setState({ options: DEFAULT_OPTIONS.filter(o => exp.test(o)) });
          }}
        />
      </Grommet>
    );
  }
}

const allSeasons = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10'];

class SeasonsSelect extends Component {
  state = {
    selectedSeasons: [],
  };

  onRemoveSeason = (season) => {
    const { selectedSeasons } = this.state;
    const newSeasons = [...selectedSeasons];
    newSeasons.splice(
      selectedSeasons.indexOf(season), 1
    );
    this.setState({
      selectedSeasons: newSeasons,
    });
  }

  renderSeason = season => (
    <Button
      key={`season_tag_${season}`}
      href='#'
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        this.onRemoveSeason(season);
      }}
      onFocus={event => event.stopPropagation()}
    >
      <Box
        align='center'
        direction='row'
        gap='xsmall'
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        margin='xsmall'
        background='accent-1'
        round='large'
      >
        <Text size='small' color='white'>{season}</Text>
        <Box background='white' round='full' margin={{ left: 'xsmall' }}>
          <FormClose
            color='accent-1'
            size='small'
            style={{ width: '12px', height: '12px' }}
          />
        </Box>
      </Box>
    </Button>
  );

  renderOption = (option) => {
    const { selectedSeasons } = this.state;
    return (
      <Box
        pad='small'
        background={
          selectedSeasons.indexOf(option) >= 0 ? 'active' : undefined
        }
      >
        {option}
      </Box>
    );
  }

  render() {
    const { selectedSeasons } = this.state;
    return (
      <Grommet theme={grommet}>
        <Box direction='row'>
          <Box align='start' basis='medium' direction='row'>
            <Select
              size='medium'
              placeholder='Select Season'
              multiple
              value={
                selectedSeasons && selectedSeasons.length
                  ? (
                    <Box wrap direction='row' style={{ width: '208px' }}>
                      {selectedSeasons.map(this.renderSeason)}
                    </Box>
                  )
                  : undefined
              }
              options={allSeasons}
              onChange={({ option }) => {
                const newSelectedSeasons = [...selectedSeasons];
                const seasonIndex = newSelectedSeasons.indexOf(option);
                if (seasonIndex >= 0) {
                  newSelectedSeasons.splice(seasonIndex, 1);
                } else {
                  newSelectedSeasons.push(option);
                }
                this.setState({ selectedSeasons: newSelectedSeasons.sort() });
              }}
            >
              {this.renderOption}
            </Select>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

const allContentPartners = [
  {
    name: 'Test Partner',
    id: '32131232',
  },
  {
    name: 'Test Partner 1',
    id: '32131232',
  },
  {
    name: 'Test Partner 2',
    id: '32131242',
  },
  {
    name: 'Test Partner 3',
    id: '32131252',
  },
  {
    name: 'Test Partner 4',
    id: '32131262',
  },
  {
    name: 'Test Partner 5',
    id: '32131272',
  },
  {
    name: 'Test Partner 6',
    id: '32131231',
  },
  {
    name: 'Test Partner 7',
    id: '32131234',
  },
  {
    name: 'Test Partner 8',
    id: '32131245',
  },
  {
    name: 'Test Partner 9',
    id: '32131256',
  },
  {
    name: 'Test Partner 10',
    id: '32131269',
  },
  {
    name: 'Test Partner 11',
    id: '32131244',
  },
];

class CustomSearchSelect extends Component {
  state = {
    contentPartners: allContentPartners,
    selectedContentPartners: [],
    searching: false,
  };

  selectRef = createRef()

  clearContentPartners = () => this.setState({ selectedContentPartners: [] })

  renderOption = ({ name }) => {
    const { selectedContentPartners } = this.state;
    return (
      <Box direction='row' align='center' pad='small' flex={false}>
        <CheckBox
          tabIndex='-1'
          checked={selectedContentPartners.some(
            partner => partner.name === name
          )}
          value={name}
          onChange={() => {}}
        />
        <Text size='small'>{name}</Text>
      </Box>
    );
  }

  renderContentPartners = () => {
    const { selectedContentPartners } = this.state;
    return (
      <Box
        direction='row'
        gap='xsmall'
        pad={{ left: 'small', vertical: 'small' }}
        align='center'
        flex
      >
        <Box
          background='brand'
          round='medium'
          align='center'
          justify='center'
          pad={{ horizontal: 'xsmall' }}
          style={{ minWidth: '21px' }}
        >
          <Text size='small'>
            {selectedContentPartners.length}
          </Text>
        </Box>
        <Box flex>
          <Text size='small' truncate>
            {selectedContentPartners.map(({ name }) => name).join(', ')}
          </Text>
        </Box>
        <Button
          href='#'
          onFocus={event => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            this.clearContentPartners();
            /* eslint-disable-next-line react/no-find-dom-node */
            findDOMNode(this.selectRef.current).focus();
          }}
        >
          <Box background='gray' round='full'>
            <FormClose style={{ width: '12px', height: '12px' }} />
          </Box>
        </Button>
      </Box>
    );
  }

  render() {
    const {
      contentPartners, searching, selectedContentPartners,
    } = this.state;

    const selectedPartnerNames = selectedContentPartners.map(({ name }) => name);

    return (
      <Grommet theme={customSearchTheme}>
        <Box align='start' width='medium' direction='row'>
          <SearchInputContext.Provider value={{ searching }}>
            <Select
              ref={this.selectRef}
              closeOnChange={false}
              placeholder='Select Content Partners'
              searchPlaceholder='Search Content Partners'
              multiple
              value={selectedContentPartners.length ? this.renderContentPartners() : undefined}
              options={contentPartners}
              onChange={({ option }) => {
                const newSelectedPartners = [...selectedContentPartners];
                const seasonIndex = newSelectedPartners.map(
                  ({ name }) => name
                ).indexOf(option.name);
                if (seasonIndex >= 0) {
                  newSelectedPartners.splice(seasonIndex, 1);
                } else {
                  newSelectedPartners.push(option);
                }
                this.setState({ selectedContentPartners: newSelectedPartners });
              }}
              onClose={() => this.setState({
                contentPartners: allContentPartners.sort((p1, p2) => {
                  const p1Exists = selectedPartnerNames.includes(p1.name);
                  const p2Exists = selectedPartnerNames.includes(p2.name);

                  if (!p1Exists && p2Exists) {
                    return 1;
                  }
                  if (p1Exists && !p2Exists) {
                    return -1;
                  }
                  if (p1.name.toLowerCase() < p2.name.toLowerCase()) {
                    return -1;
                  }
                  return 1;
                }),
              })}
              onSearch={
                (query) => {
                  this.setState({ searching: true }, () => {
                    setTimeout(() => {
                      this.setState(
                        {
                          searching: false,
                          contentPartners: allContentPartners.filter(
                            s => s.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
                          ),
                        }
                      );
                    }, 500);
                  });
                }
              }
            >
              {this.renderOption}
            </Select>
          </SearchInputContext.Provider>
        </Box>
      </Grommet>
    );
  }
}

class DarkSelect extends Component {
  state = {
    options: ['one', 'two'],
    value: '',
  }

  render() {
    const { options, value } = this.state;
    return (
      <Grommet full theme={grommet} {...this.props}>
        <Box fill background='dark-1' align='center' justify='center'>
          <Select
            placeholder='Select'
            value={value}
            options={options}
            onChange={({ option }) => this.setState({ value: option })}
          />
        </Box>
      </Grommet>
    );
  }
}

storiesOf('Select', module)
  .add('Simple Select', () => <SimpleSelect />)
  .add('Search Select', () => <SearchSelect />)
  .add('Seasons Select', () => <SeasonsSelect />)
  .add('Custom Search', () => <CustomSearchSelect />)
  .add('Dark', () => <DarkSelect />)
  .add('Custom Colors', () => (
    <DarkSelect theme={{ global: { font: { family: 'Arial' } }, select: { background: '#000000', iconColor: '#d3d3d3' } }} />
  ))
  .add('Custom Rounded', () => (
    <SimpleSelect theme={customRoundedTheme} />
  ));
