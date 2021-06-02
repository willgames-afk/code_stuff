removeNonUpperclass :: String -> String 
removeNonUpperclass st = [c | c <- st, c `elem` ['A' .. 'Z']]

addThree :: Int -> Int -> Int -> Int 
addThree x y z = x + y + z

lucky :: (Integral a) => a -> String 
lucky 7 = "LUCKY NUMBER SEVEN!!!"
lucky x = "Sorry, you're outa luck pal."

head' :: [a] -> a
head' [ ] = error "Empty List"
head' (x:_) = x

capital :: String -> String 
capital "" = "Error: Empty String"
capital all@(x:_) = "The first letter of " ++ all ++ " is " ++ [x]

numTell :: (RealFloat a) => a -> a -> String 
numTell width height
    | area <= 2.0 = "You're Tiny! I bet you can't cover Anything."
    | area <= 10.12345  = "You are normal. And boring. And people will Never, Ever notice you."
    | area <= 30.5 = "You're gigantic! If you were a blanket, you'd be hard to straighten."
    | otherwise = "You're ridiculously large. Nobody will want to unfold you."
    where area = width * height

