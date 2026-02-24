import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Icon } from '../../icons/SailIcons';

export default function TbdPlaceholder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = searchParams.get('step') || '1';

  return (
    <div className="p-8">
      {/* Back to index */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm text-subdued hover:text-default cursor-pointer mb-6 transition-colors"
      >
        <Icon name="arrowLeft" size="xsmall" fill="currentColor" />
        Prototypes
      </button>

      <h1 className="text-2xl font-semibold text-default mb-2">
        TBD Prototype
      </h1>
      <p className="text-subdued mb-8">
        This prototype is not yet defined. Use it as a starting point for your
        next exploration.
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === '1'
              ? 'bg-button-primary-bg text-button-primary-text'
              : 'bg-offset text-subdued'
          }`}
        >
          1
        </div>
        <div className="w-8 h-px bg-border" />
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === '2'
              ? 'bg-button-primary-bg text-button-primary-text'
              : 'bg-offset text-subdued'
          }`}
        >
          2
        </div>
      </div>

      {/* Screen content */}
      <div className="border border-dashed border-border rounded-lg py-16 px-8 flex flex-col items-center justify-center max-w-xl">
        <div className="text-base font-semibold text-default mb-1">
          {step === '1' ? 'Screen 1' : 'Screen 2'}
        </div>
        <p className="text-sm text-subdued mb-6">
          {step === '1'
            ? 'Replace this placeholder with your first screen.'
            : 'Replace this placeholder with your second screen.'}
        </p>
        {step === '1' ? (
          <Button
            variant="primary"
            onClick={() => setSearchParams({ step: '2' })}
          >
            Continue to screen 2
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setSearchParams({ step: '1' })}
          >
            Back to screen 1
          </Button>
        )}
      </div>
    </div>
  );
}
