=begin
var texData = {
	'layers': 80,
	'rows': 80,
	'cols': 80,
	'samples': []
}
=end

puts 'var texData = {'

dims = gets.split( ' ' )

layers = dims[0].to_i
rows = dims[1].to_i
cols = dims[2].to_i 


#read all numbers into giant array 
nums = []
loop do 
	line = gets; break unless line 
	
	line.split(' ').each do |num|
		nums << num.to_f 
	end 
end 

puts "\t'layers': #{layers},"
puts "\t'rows': #{rows},"
puts "\t'cols': #{cols},"
puts "\t'samples': ["

i = 0
min = 999999999
max = 0
layers.times do
	puts "\t\t["

	rows.times do
		print "\t\t\t["
	
		cols.times do
			print "#{nums[i]}, "
			
			if nums[i] < min 
				min = nums[i]
			elsif nums[i] > max 
				max = nums[i]
			end 
			
			i += 1 
		end

		puts "\t\t\t],"		
	end 
	
	puts "\t\t],"
end 

puts "\t],"

puts "\t'min': #{min},"
puts "\t'max': #{max}"

puts '}'