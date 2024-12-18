import React from 'react';
import { render, screen } from '@testing-library/react';
import { JobSteps } from '../JobSteps';
import { validateStep } from '../../../../../utils/contentValidation';

jest.mock('../JobStep1', () => ({
  JobStep1: () => <div data-testid="job-step-1">Step 1</div>
}));

jest.mock('../JobStep5', () => ({
  JobStep5: () => <div data-testid="job-step-5">Step 5</div>
}));
jest.mock('../../../../../utils/contentValidation');

describe('JobSteps', () => {
  const defaultProps = {
    step: 1,
    formData: {},
    onStepChange: jest.fn(),
    onSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (validateStep as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
  });

  it('renders correct step component based on step prop', () => {
    const props = {
      ...defaultProps,
      step: 1
    };

    render(<JobSteps {...props} />);
    expect(screen.getByTestId('job-step-1')).toBeInTheDocument();
  });

  it('renders null when step is out of range', () => {
    const props = {
      ...defaultProps,
      step: 6
    };

    const { container } = render(<JobSteps {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('validates data before proceeding to next step', () => {
    (validateStep as jest.Mock).mockReturnValue({
      isValid: false,
      errors: { title: 'Title is required' }
    });

    const props = {
      ...defaultProps,
      step: 1,
      formData: {}
    };

    render(<JobSteps {...props} />);
    expect(validateStep).toHaveBeenCalledWith('job', 1, {});
  });

  it('passes correct props to step components', () => {
    const props = {
      ...defaultProps,
      step: 1,
      formData: { title: 'Test Job' }
    };

    render(<JobSteps {...props} />);
    
    expect(screen.getByTestId('job-step-1')).toBeInTheDocument();
    expect(validateStep).toHaveBeenCalled();
  });
});