
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Save, Trash2, Download } from 'lucide-react';
import { fetchAllVocabulary } from '@/services/vocabularyService';
import Papa from 'papaparse';

const GEMINI_KEY_STORAGE = 'gemini_api_key';

export default function Settings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem(GEMINI_KEY_STORAGE, apiKey);
    toast({
      title: 'Success',
      description: 'Gemini API key saved locally',
    });
  };

  const handleDeleteKey = () => {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
    setApiKey('');
    toast({
      title: 'Key Removed',
      description: 'Gemini API key deleted from local storage',
    });
  };

  const handleExportVocabulary = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const vocabulary = await fetchAllVocabulary();

      let content = '';
      let type = '';
      let extension = '';

      if (format === 'csv') {
        content = Papa.unparse(vocabulary);
        type = 'text/csv;charset=utf-8;';
        extension = 'csv';
      } else {
        content = JSON.stringify(vocabulary, null, 2);
        type = 'application/json;charset=utf-8;';
        extension = 'json';
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vocabulary_export_${new Date().toISOString().split('T')[0]}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: `Exported ${vocabulary.length} vocabulary items as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export vocabulary data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your Langobridge preferences and AI keys</p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">AI Configuration</CardTitle>
          <CardDescription>
            Manage your Google Gemini API key. This key is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-key">Gemini API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="gemini-key"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button onClick={handleSaveKey} size="icon" className="shrink-0">
                <Save className="h-4 w-4" />
              </Button>
              {apiKey && (
                <Button
                  onClick={handleDeleteKey}
                  variant="destructive"
                  size="icon"
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground pt-1">
              Need a key? Get one from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Data Management</CardTitle>
          <CardDescription>
            Export your data for backup or analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Export Vocabulary</Label>
              <p className="text-xs text-muted-foreground">Download all vocabulary data.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleExportVocabulary('csv')} disabled={isExporting} variant="outline">
                {isExporting ? 'Exporting...' : <><Download className="mr-2 h-4 w-4" /> CSV</>}
              </Button>
              <Button onClick={() => handleExportVocabulary('json')} disabled={isExporting} variant="outline">
                {isExporting ? 'Exporting...' : <><Download className="mr-2 h-4 w-4" /> JSON</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
