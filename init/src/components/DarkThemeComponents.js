/* 
 * REUSABLE DARK THEME STYLED COMPONENTS
 * Import and use these across all pages for consistency
 * 
 * Usage:
 * import { DarkCard, PrimaryButton, DarkTable } from '../components/DarkThemeComponents';
 */

import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ============================================
// CONTAINERS & LAYOUTS
// ============================================

export const PageContainer = styled.div`
  animation: fadeIn 0.6s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const DarkCard = styled.div`
  background: rgba(26, 50, 99, 0.8);
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 0.75rem;
  padding: ${props => props.padding || '1.5rem'};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  margin-bottom: ${props => props.marginBottom || '1.5rem'};

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(250, 185, 91, 0.5);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  ${props => props.nohover && `
    &:hover {
      transform: none;
      border-color: rgba(84, 119, 146, 0.3);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }
  `}
`;

export const GlassCard = styled(DarkCard)`
  background: rgba(26, 50, 99, 0.4);
  backdrop-filter: blur(15px);
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${props => props.gap || '1.5rem'};
  margin-bottom: 2rem;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'center'};
  gap: ${props => props.gap || '1rem'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

// ============================================
// TYPOGRAPHY
// ============================================

export const PageTitle = styled.h1`
  color: #E8E2DB;
  font-size: ${props => props.size || '1.8rem'};
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 10px rgba(250, 185, 91, 0.3);
  animation: slideUp 0.6s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SectionTitle = styled.h2`
  color: #E8E2DB;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 10px rgba(250, 185, 91, 0.2);
`;

export const CardTitle = styled.h3`
  color: #FAB95B;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(84, 119, 146, 0.2);
  padding-bottom: 0.75rem;
`;

export const BodyText = styled.p`
  color: ${props => props.muted ? '#547792' : '#E8E2DB'};
  font-size: ${props => props.size || '0.95rem'};
  line-height: 1.6;
  margin: ${props => props.margin || '0'};
`;

export const HighlightText = styled.span`
  color: #FAB95B;
  font-weight: 600;
`;

// ============================================
// BUTTONS
// ============================================

export const PrimaryButton = styled.button`
  background: #FAB95B;
  color: #1A3263;
  border: 1px solid #FAB95B;
  border-radius: ${props => props.rounded ? '2rem' : '0.5rem'};
  padding: ${props => props.size === 'large' ? '1rem 2rem' : '0.75rem 1.5rem'};
  font-size: ${props => props.size === 'large' ? '1rem' : '0.9rem'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(250, 185, 91, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background: rgba(84, 119, 146, 0.3);
  color: #E8E2DB;
  border: 1px solid rgba(84, 119, 146, 0.5);

  &:hover {
    background: rgba(84, 119, 146, 0.4);
    border-color: #FAB95B;
  }
`;

export const OutlineButton = styled(PrimaryButton)`
  background: transparent;
  color: #FAB95B;
  border: 2px solid #FAB95B;

  &:hover {
    background: rgba(250, 185, 91, 0.1);
  }
`;

export const IconButton = styled.button`
  background: rgba(26, 50, 99, 0.6);
  color: #FAB95B;
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(250, 185, 91, 0.2);
    border-color: #FAB95B;
    transform: scale(1.1);
  }
`;

// ============================================
// FORMS & INPUTS
// ============================================

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  color: #E8E2DB;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  background: #0F1B3D;
  color: #E8E2DB;
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FAB95B;
    box-shadow: 0 0 0 3px rgba(250, 185, 91, 0.1);
  }

  &::placeholder {
    color: #547792;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: #0F1B3D;
  color: #E8E2DB;
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FAB95B;
    box-shadow: 0 0 0 3px rgba(250, 185, 91, 0.1);
  }

  &::placeholder {
    color: #547792;
  }
`;

export const Select = styled.select`
  width: 100%;
  background: #0F1B3D;
  color: #E8E2DB;
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FAB95B;
    box-shadow: 0 0 0 3px rgba(250, 185, 91, 0.1);
  }

  option {
    background: #0F1B3D;
    color: #E8E2DB;
  }
`;

// ============================================
// TABLES
// ============================================

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.75rem;
  background: rgba(15, 27, 61, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(84, 119, 146, 0.2);
`;

export const DarkTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th {
    color: #FAB95B;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.8rem;
    padding: 1rem;
    text-align: left;
    background: rgba(26, 50, 99, 0.6);
    border-bottom: 1px solid rgba(84, 119, 146, 0.3);
  }

  td {
    color: #E8E2DB;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(84, 119, 146, 0.2);
  }

  tbody tr {
    transition: all 0.3s ease;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};

    &:hover {
      background: rgba(84, 119, 146, 0.2);
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

// ============================================
// BADGES & STATUS
// ============================================

export const Badge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: ${props => props.rounded ? '2rem' : '0.5rem'};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch(props.variant) {
      case 'success': return 'rgba(250, 185, 91, 0.2)';
      case 'warning': return 'rgba(84, 119, 146, 0.2)';
      case 'error': return 'rgba(220, 53, 69, 0.2)';
      default: return 'rgba(84, 119, 146, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'success': return '#FAB95B';
      case 'warning': return '#547792';
      case 'error': return '#FAB95B';
      default: return '#547792';
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'success': return 'rgba(250, 185, 91, 0.4)';
      case 'warning': return 'rgba(84, 119, 146, 0.4)';
      case 'error': return 'rgba(220, 53, 69, 0.3)';
      default: return 'rgba(84, 119, 146, 0.4)';
    }
  }};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

// ============================================
// LOADING & EMPTY STATES
// ============================================

export const LoadingContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: #E8E2DB;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const Spinner = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: 4px solid rgba(84, 119, 146, 0.2);
  border-radius: 50%;
  border-top-color: #FAB95B;
  animation: spin 1s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(250, 185, 91, 0.3);

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #547792;
  
  svg {
    color: #FAB95B;
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    color: #E8E2DB;
    margin-bottom: 0.5rem;
  }

  p {
    color: #547792;
  }
`;

export const ErrorMessage = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(220, 53, 69, 0.2);
  color: #FAB95B;
  border-radius: 0.75rem;
  border: 1px solid rgba(220, 53, 69, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;

  svg {
    color: #FAB95B;
    flex-shrink: 0;
  }
`;

export const SuccessMessage = styled(ErrorMessage)`
  background: rgba(250, 185, 91, 0.2);
  border-color: rgba(250, 185, 91, 0.4);
`;

// ============================================
// LINKS
// ============================================

export const StyledLink = styled(Link)`
  color: #FAB95B;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: #E8E2DB;
    transform: translateX(3px);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

// ============================================
// DIVIDERS
// ============================================

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(84, 119, 146, 0.2);
  margin: ${props => props.margin || '1.5rem 0'};
`;

// ============================================
// METRIC CARDS (Special)
// ============================================

export const MetricCard = styled.div`
  background: rgba(26, 50, 99, 0.8);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-left: 4px solid ${props => props.color || '#FAB95B'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color || '#FAB95B'};
    box-shadow: 0 0 15px ${props => props.color || '#FAB95B'};
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 
                0 0 20px ${props => `${props.color || '#FAB95B'}40`};
    border-color: ${props => props.color || '#FAB95B'};
  }

  .metric-label {
    color: #547792;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .metric-value {
    color: #E8E2DB;
    font-size: 1.8rem;
    font-weight: 300;
    margin: 0;
  }
`;

export default {
  PageContainer,
  DarkCard,
  GlassCard,
  GridContainer,
  FlexContainer,
  PageTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  HighlightText,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  IconButton,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  TableContainer,
  DarkTable,
  Badge,
  LoadingContainer,
  Spinner,
  EmptyState,
  ErrorMessage,
  SuccessMessage,
  StyledLink,
  Divider,
  MetricCard,
};
