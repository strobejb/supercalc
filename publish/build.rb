require 'nokogiri'
require 'zip/zip'
require 'fileutils'
require 'pp'

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

def main() 

  #
  # Increment build number
  #
  xml = Nokogiri::XML(File.open('../gadget.xml'))

  x = xml.search('gadget/version')[0]
  
  vers = x.content().split('.')
  while vers.length < 4 do
   vers << '0'
  end

  vers[-1].succ!
  x.content = vers.join('.')

  puts "Building supercalc #{x.content}"

  File.open('../gadget.xml', 'w') { |f| f.write xml.to_xml }  

  #
  # Build the zip
  #
  zipname = 'supercalc.gadget'
  ignore  = ['.git', 'publish/*', 'test/*', '*.psd']

  zipdir('..', zipname, ignore )
end

main()
