require 'zip/zip'
require 'fileutils'

def zipdir(path, zippath, ignore=[])

  FileUtils.rm zippath, :force=>true

  #olddir = Dir.getwd()
  #Dir.chdir(path)  

  Zip::ZipFile.open(zippath, Zip::ZipFile::CREATE) do |zipfile|
    
    Dir["#{path}/**/**"].reject{ |f| f1=f.sub(path+'/',''); ignore.count{|ig| File.fnmatch(ig,f1)} > 0 || f == zippath || File.directory?(f) }.each do |file|
    
      puts file
      zipfile.add(file.sub(path+'/',''), file)
    end
  end

end

zipname = 'supercalc.gadget'
ignore  = ['.git', 'publish/*', 'test/*', '*.psd']

zipdir('..', zipname, ignore )
