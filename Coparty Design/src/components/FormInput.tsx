import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  multiline?: boolean;
  rows?: number;
  rightElement?: ReactNode;
  rightElementOffsetClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, error, size = 'md', className = '', multiline = false, rows, rightElement, rightElementOffsetClassName, ...props }, ref) => {
    const sizes = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4'
    };
    
    const baseClasses = 'w-full border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 hover:border-accent-foreground/20';
    const errorClasses = error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : '';
    const rightPadding = rightElement ? 'pr-12' : '';
    const classes = `${baseClasses} ${sizes[size]} ${errorClasses} ${rightPadding} ${className}`;
    
    const inputStyle = {
      backgroundColor: '#111111',
      color: 'white'
    };
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-foreground">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={classes}
            rows={rows}
            style={inputStyle}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
        <div className="relative">
          <input
              ref={ref as React.Ref<HTMLInputElement>}
            className={classes}
            style={inputStyle}
            {...props}
          />
          {rightElement && (
            <div className={`absolute inset-y-0 flex items-center ${rightElementOffsetClassName || 'right-0 pr-3'}`}>
              {rightElement}
            </div>
          )}
        </div>
        )}
        {error && (
          <p className="text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";