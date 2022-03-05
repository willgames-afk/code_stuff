function love.load()
	love.window.setTitle("Smol Game")
end

function love.draw()
	x = love.mouse.getX();
	y = love.mouse.getY();
	love.graphics.print("Hello, world!", x, y)
end