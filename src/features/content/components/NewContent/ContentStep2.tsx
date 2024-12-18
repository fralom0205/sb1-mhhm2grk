import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { ContentStepProps } from '../../types/newContentTypes';

export function ContentStep2({ data, onNext, onBack }: ContentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>(data.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      content: formData.get('content') as string,
      tags,
      category: formData.get('category') as string,
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!stepData.content) newErrors.content = 'Il contenuto è obbligatorio';
    if (tags.length === 0) newErrors.tags = 'Aggiungi almeno un tag';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenuto
        </label>
        <textarea
          name="content"
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          defaultValue={data.content}
          placeholder="Scrivi qui il tuo contenuto..."
          required
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tag
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="Aggiungi un tag..."
          />
          <Button type="button" onClick={handleAddTag}>
            Aggiungi
          </Button>
        </div>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Indietro
        </Button>
        <Button type="submit">
          Continua
        </Button>
      </div>
    </form>
  );
}