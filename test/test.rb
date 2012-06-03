require 'sinatra'
require 'haml'

set :public_folder, File.dirname(__FILE__)

get '/' do 
  File.read('test.htm');
end
