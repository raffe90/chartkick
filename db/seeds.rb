# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

6.times{Cholesterol.create({date: Faker::Date.backward(3650), ldl: Faker::Number.between(1, 500), hdl: Faker::Number.between(1, 500), triglycerides: Faker::Number.between(1, 500), cholesterol: Faker::Number.between(1, 500)})}
