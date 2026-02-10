import { useState } from "react";
import { BulkVocabularyUpload } from "@/components/BulkVocabularyUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, ArrowRight, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BulkUpload() {
  const navigate = useNavigate();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    added: 0,
    duplicates: 0,
    total: 0,
  });

  const handleSuccess = (stats: {
    added: number;
    duplicates: number;
    total: number;
  }) => {
    setUploadStats(stats);
    setIsSuccessDialogOpen(true);
  };

  const handleCancel = () => {
    navigate("/vocabulary");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Upload</h1>
        <p className="text-muted-foreground">
          Import multiple vocabulary items at once using CSV or JSON files
        </p>
      </div>

      {/* Bulk Upload Component */}
      <Card>
        <CardContent className="p-6">
          <BulkVocabularyUpload
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 bg-background/80 backdrop-blur-lg shadow-2xl">
          <DialogHeader className="pt-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4 animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Batch Sync Complete!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Your vocabulary synchronization is finished. Here is the summary
              of the operations performed.
            </DialogDescription>
          </DialogHeader>

          {/* Detailed Statistics Breakdown */}
          <div className="py-6 px-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider font-bold text-green-600 mb-1">
                  New
                </p>
                <p className="text-2xl font-black text-green-700">
                  {uploadStats.added}
                </p>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600 mb-1">
                  Skipped
                </p>
                <p className="text-2xl font-black text-amber-700">
                  {uploadStats.duplicates}
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider font-bold text-primary mb-1">
                  Total
                </p>
                <p className="text-2xl font-black text-primary">
                  {uploadStats.total}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium italic">
                Status:
              </span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> All data processed
              </span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/5"
              onClick={() => setIsSuccessDialogOpen(false)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload More
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
              onClick={() => navigate("/vocabulary")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              To Vocabulary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
