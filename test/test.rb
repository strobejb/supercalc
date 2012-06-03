require 'sinatra'
require 'haml'

puts File.dirname(__FILE__)
set :public_folder, File.dirname(__FILE__) + '/..'

get '/' do 
  File.read('../supercalc.html');
end
