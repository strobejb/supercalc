#
# ruby build script for catch22 supercalc
# run from the ./build directory
#
require 'nokogiri'
require 'zip/zip'
require 'fileutils'
require 'pp'

def zipdir(path, zippath, ignore=[])

  FileUtils.rm zippath, :force=>true

  Zip::ZipFile.open(zippath, Zip::ZipFile::CREATE) do |zipfile|
    
    Dir["#{path}/**/**"].reject{ |f| f1=f.sub(path+'/',''); ignore.count{|ig| File.fnmatch(ig,f1)} > 0 || f == zippath || File.directory?(f) }.each do |file|
    
      puts file
      zipfile.add(file.sub(path+'/',''), file)
    end
  end

end

def incbuild(gadgetxml)

  # read gadget.xml
  xml = Nokogiri::XML(File.open(gadgetxml))

  x = xml.search('gadget/version')[0]
  
  # extract the version# and padd with extra 0's if necessary
  vers = x.content().split('.')
  while vers.length < 4 do
   vers << '0'
  end

  # inc the build count (last number in the x.x.x.x string)
  vers[-1].succ!
  x.content = vers.join('.')

  # save gadget.xml
  File.open(gadgetxml, 'w') { |f| f.write xml.to_xml }  

  return x.content.to_s

end

def build() 

  #
  # Increment build number
  #
  version = incbuild('../gadget.xml')

  puts "Building supercalc #{version}"

  #
  # Build the zip
  #
  zipname = "supercalc-#{version}.gadget"
  ignore  = ['.git', 'varmap.txt', 'build/*', 'test/*', '*.psd']

  zipdir('..', zipname, ignore )
end

build()
