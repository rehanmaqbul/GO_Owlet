
import { School } from 'lucide-react';

export function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-owl-blue to-owl-blue-dark flex items-center justify-center shadow-lg">
          <School className="text-white h-10 w-10" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-owl-slate-dark">Guardian Owlet</h1>
      <p className="text-owl-slate mt-2">Welcome to your educational companion</p>
    </div>
  );
}
