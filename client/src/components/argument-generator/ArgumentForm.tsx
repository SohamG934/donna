import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArgumentData } from '@/lib/types';

interface ArgumentFormProps {
  onSubmit: (data: ArgumentData) => void;
  isSubmitting: boolean;
}

const argumentSchema = z.object({
  title: z.string().min(1, "Case title is required"),
  jurisdiction: z.string().min(1, "Jurisdiction is required"),
  type: z.string().min(1, "Case type is required"),
  acts: z.string().min(1, "Relevant acts/sections are required"),
  facts: z.string().min(1, "Case facts are required"),
  side: z.enum(["prosecution", "defense"])
});

const ArgumentForm: React.FC<ArgumentFormProps> = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ArgumentData>({
    resolver: zodResolver(argumentSchema),
    defaultValues: {
      title: '',
      jurisdiction: '',
      type: '',
      acts: '',
      facts: '',
      side: 'prosecution'
    }
  });

  const jurisdictions = [
    { value: 'supreme-court', label: 'Supreme Court of India' },
    { value: 'bombay-hc', label: 'Bombay High Court' },
    { value: 'delhi-hc', label: 'Delhi High Court' },
    { value: 'madras-hc', label: 'Madras High Court' },
    { value: 'calcutta-hc', label: 'Calcutta High Court' },
    { value: 'allahabad-hc', label: 'Allahabad High Court' },
    { value: 'sessions-court', label: 'Sessions Court' }
  ];

  const caseTypes = [
    { value: 'criminal', label: 'Criminal' },
    { value: 'civil', label: 'Civil' },
    { value: 'constitutional', label: 'Constitutional' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'ipr', label: 'Intellectual Property' },
    { value: 'tax', label: 'Taxation' },
    { value: 'family', label: 'Family Law' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title" className={errors.title ? 'text-red-500' : ''}>
              Case Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., State of Maharashtra vs. John Doe"
              {...register('title')}
              className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="jurisdiction" className={errors.jurisdiction ? 'text-red-500' : ''}>
              Jurisdiction
            </Label>
            <Controller
              control={control}
              name="jurisdiction"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={errors.jurisdiction ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.jurisdiction && (
              <p className="text-xs text-red-500 mt-1">{errors.jurisdiction.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type" className={errors.type ? 'text-red-500' : ''}>
              Case Type
            </Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Case Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="acts" className={errors.acts ? 'text-red-500' : ''}>
              Relevant Acts/Sections
            </Label>
            <Input
              id="acts"
              placeholder="e.g., IPC Section 302, Evidence Act Section 27"
              {...register('acts')}
              className={errors.acts ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.acts && (
              <p className="text-xs text-red-500 mt-1">{errors.acts.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="facts" className={errors.facts ? 'text-red-500' : ''}>
              Case Facts
            </Label>
            <Textarea
              id="facts"
              placeholder="Describe the key facts of the case..."
              className={`min-h-32 ${errors.facts ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register('facts')}
            />
            {errors.facts && (
              <p className="text-xs text-red-500 mt-1">{errors.facts.message}</p>
            )}
          </div>

          <div>
            <Label className={errors.side ? 'text-red-500' : ''}>
              Generate Arguments For
            </Label>
            <Controller
              control={control}
              name="side"
              render={({ field }) => (
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prosecution" id="prosecution" />
                    <Label htmlFor="prosecution" className="font-normal">Prosecution</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defense" id="defense" />
                    <Label htmlFor="defense" className="font-normal">Defense</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.side && (
              <p className="text-xs text-red-500 mt-1">{errors.side.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-navy hover:bg-navy-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating Arguments...' : 'Generate Arguments'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArgumentForm;
